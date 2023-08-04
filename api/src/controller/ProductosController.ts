import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Producto } from "../entity/Producto";
import { validate } from "class-validator";

class ProductosController {
  static getAll = async (req: Request, resp: Response) => {
    try {
      const productosRepo = AppDataSource.getRepository(Producto);

      const listaProductos = await productosRepo.find({
        where: { estado: true },
      });

      if (listaProductos.length == 0) {
        return resp.status(404).json({ mensaje: "No se encontró resultados." });
      }
      return resp.status(200).json(listaProductos);
    } catch (error) {
      return resp.status(400).json({ mensaje: error });
    }
  };

  static getById = async (req: Request, resp: Response) => {
    try {
      const id = parseInt(req.params["id"]);

      if (!id) {
        return resp.status(404).json({ mensaje: "No se indica el ID" });
      }

      const productosRepo = AppDataSource.getRepository(Producto);

      let producto;
      try {
        producto = await productosRepo.findOneOrFail({
          where: { id, estado: true },
        });
      } catch (error) {
        return resp
          .status(404)
          .json({ mensaje: "No se encontro el producto con ese ID" });
      }

      return resp.status(200).json(producto);
    } catch (error) {
      return resp.status(400).json({ mensaje: error });
    }
  };

  static add = async (req: Request, resp: Response) => {
    try {
      //DESTRUCTURING
      const { id, nombre, precio, stock, fechaIngreso } = req.body;

      //validacion de datos de entrada
      if (!id) {
        return resp.status(404).json({ mensaje: "Debe indicar el ID" });
      }
      if (!nombre) {
        return resp
          .status(404)
          .json({ mensaje: "Debe indicar el nombre del producto" });
      }
      if (!precio) {
        return resp.status(404).json({ mensaje: "Debe indicar el precio" });
      }
      if (precio < 0) {
        return resp
          .status(404)
          .json({ mensaje: "Debe indicar un precio mayor que 0" });
      }
      if (!stock) {
        return resp
          .status(404)
          .json({ mensaje: "Debe indicar el stock del producto" });
      }
      if (stock < 0) {
        return resp
          .status(404)
          .json({ mensaje: "El stock debe ser mayor que ser" });
      }

      //validacion de reglas de negocio
      const productosRepo = AppDataSource.getRepository(Producto);
      const pro = await productosRepo.findOne({ where: { id } });

      if (pro) {
        return resp
          .status(404)
          .json({ mensaje: "El producto ya existe en la base datos." });
      }

      const fecha = new Date();

      let producto = new Producto();
      producto.id = id;
      producto.nombre = nombre;
      producto.precio = precio;
      producto.stock = stock;
      producto.fechaIngreso = fecha;
      producto.estado = true;

      //validar con class validator
      const errors = await validate(producto, {
        validationError: { target: false, value: false },
      });

      if (errors.length > 0) {
        return resp.status(400).json(errors);
      }

      await productosRepo.save(producto);
      return resp.status(201).json({ mensaje: "Producto creado" });
    } catch (error) {
      return resp.status(400).json({ mensaje: error });
    }
  };

  static update = async (req: Request, resp: Response) => {
    const { id, nombre, precio, stock, fechaIngreso } = req.body;

    //validacion de datos de entrada
    if (!id) {
      return resp.status(404).json({ mensaje: "Debe indicar el ID" });
    }
    if (!nombre) {
      return resp
        .status(404)
        .json({ mensaje: "Debe indicar el nombre del producto" });
    }
    if (!precio) {
      return resp.status(404).json({ mensaje: "Debe indicar el precio" });
    }
    if (precio < 0) {
      return resp
        .status(404)
        .json({ mensaje: "Debe indicar un precio mayor que 0" });
    }
    if (!stock) {
      return resp
        .status(404)
        .json({ mensaje: "Debe indicar el stock del producto" });
    }
    if (stock < 0) {
      return resp
        .status(404)
        .json({ mensaje: "El stock debe ser mayor que ser" });
    }

    //validacion de reglas de negocio
    const productosRepo = AppDataSource.getRepository(Producto);
    let pro: Producto;
    try {
      pro = await productosRepo.findOneOrFail({ where: { id } });
    } catch (error) {
      return resp.status(404).json({ mensaje: "No existe el producto." });
    }

    pro.nombre = nombre;
    pro.precio = precio;
    pro.stock = stock;
    // pro.fechaIngreso

    //validar con class validator
    const errors = await validate(pro, {
      validationError: { target: false, value: false },
    });

    if (errors.length > 0) {
      return resp.status(400).json(errors);
    }

    try {
      await productosRepo.save(pro);
      return resp.status(200).json({ mensaje: "Se guardo correctamente" });
    } catch (error) {
      return resp.status(400).json({ mensaje: "No pudo guardar." });
    }
  };
  static delete = async (req: Request, resp: Response) => {
    try {
      const id = parseInt(req.params["id"]);
      if (!id) {
        return resp.status(404).json({ mensaje: "Debe indicar el ID" });
      }

      const productosRepo = AppDataSource.getRepository(Producto);
      let pro: Producto;
      try {
        pro = await productosRepo.findOneOrFail({
          where: { id: id, estado: true },
        });
      } catch (error) {
        return resp
          .status(404)
          .json({ mensaje: "No se encuentra el producto con ese ID" });
      }

      pro.estado = false;
      try {
        await productosRepo.save(pro);
        return resp.status(200).json({ mensaje: "Se eliminó correctamente" });
      } catch (error) {
        return resp.status(400).json({ mensaje: "No se pudo eliminar." });
      }
    } catch (error) {
      return resp.status(400).json({ mensaje: "No se pudo eliminar" });
    }
  };
}

export default ProductosController;
