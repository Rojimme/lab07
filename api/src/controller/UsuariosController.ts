import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { errorMonitor } from 'events';
import { Usuario } from '../entity/Usuario';
import { validate } from 'class-validator';

class UsuariosController {
  static getAll = async (req: Request, resp: Response) => {
    try {
      const usuariosUsos = AppDataSource.getRepository(Usuario);
      const UsuariosControl = await usuariosUsos.find({
        where: { estado: true },
      });

      if (UsuariosControl.length == 0) {
        return resp
          .status(404)
          .json({ mensaje: 'No existe registro de estos datos' });
      }

      return resp.status(200).json(UsuariosControl);
    } catch (error) {
      return resp.status(400).json({ mensaje: 'Error existente en los datos' });
    }
  };

  static add = async (req: Request, resp: Response) => {
    try {
      const { cedula, nombre, apellido1, apellido2, correo, rol, contrasena } =
        req.body;

      const fecha = new Date();

      let persona = new Usuario();
      persona.cedula = cedula;
      persona.nombre = nombre;
      persona.apellido1 = apellido1;
      persona.apellido2 = apellido2;
      persona.fecha_ingreso = fecha;
      persona.correo = correo;
      persona.contrasena = contrasena;
      persona.rol = rol;
      persona.estado = true;

      const validateOpt = { validationError: { target: false, value: false } };
      const errores = await validate(persona, validateOpt);

      if (errores.length != 0) {
        return resp.status(400).json(errores);
      }
      const usuariosExist = AppDataSource.getRepository(Usuario);
      let usuarioExist = await usuariosExist.findOne({
        where: { cedula: cedula },
      });
      if (usuarioExist) {
        resp.status(400).json({ mensaje: 'Gracias, el usuario ya existe' });
      }

      usuarioExist = await usuariosExist.findOne({ where: { correo: correo } });
      if (usuarioExist) {
        resp
          .status(400)
          .json({ mensaje: 'Ya existe un usuario registrado con el correo.' });
      }

      persona.hashPassword();

      try {
        await usuariosExist.save(persona);
        return resp.status(201).json({ mensaje: 'Se ha creado correctamente' });
      } catch (error) {
        resp.status(400).json(error);
      }
    } catch (error) {
      resp.status(400).json({ mensaje: 'Error existente' });
    }
  };

  static update = async (req: Request, resp: Response) => {
    const { cedula, nombre, apellido1, apellido2, correo, rol, contrasena } =
      req.body;
    const usuariosExist = AppDataSource.getRepository(Usuario);
    let per: Usuario;
    try {
      per = await usuariosExist.findOneOrFail({ where: { cedula } });
    } catch (error) {
      return resp
        .status(404)
        .json({
          mensaje: 'No se encuentra este usuario, verifique su ingreso',
        });
    }

    per.cedula = cedula;
    per.nombre = nombre;
    per.apellido1 = apellido1;
    per.apellido2 = apellido2;
    per.correo = correo;
    per.rol = rol;
    per.contrasena = contrasena;

    const errors = await validate(per, {
      validationError: { target: false, value: false },
    });

    if (errors.length > 0) {
      return resp.status(400).json(errors);
    }

    try {
      await usuariosExist.save(per);
      return resp
        .status(200)
        .json({ mensaje: 'Se ingresó de manera correcta' });
    } catch (error) {
      return resp.status(400).json({ mensaje: 'error existente' });
    }
  };

  static delete = async (req: Request, resp: Response) => {
    try {
      const cedula = req.params['cedula'];
      if (!cedula) {
        return resp.status(404).json({ mensaje: 'Debe indicar la cédula' });
      }

      const usuariosExist = AppDataSource.getRepository(Usuario);
      let persona: Usuario;
      try {
        persona = await usuariosExist.findOneOrFail({
          where: { cedula: cedula, estado: true },
        });
      } catch (error) {
        return resp
          .status(404)
          .json({ mensaje: 'Usuario no encontrado con este número de cédula' });
      }

      persona.estado = false;
      try {
        await usuariosExist.save(persona);
        return resp
          .status(200)
          .json({ mensaje: 'Se eliminó el usuario exitosamente' });
      } catch (error) {
        return resp
          .status(400)
          .json({ mensaje: 'No se puedo eliminar correctamente' });
      }
    } catch (error) {
      return resp
        .status(400)
        .json({ mensaje: 'No se puedo eliminar correctamenteminar' });
    }
  };
}

export default UsuariosController;
