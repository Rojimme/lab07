import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entity/Usuario";

export const checkRoles = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { cedula } = res.locals.payload;

    const usuarioRepo = AppDataSource.getRepository(Usuario);

    let usuario: Usuario;
    try {
      usuario = await usuarioRepo.findOne({ where: { cedula: cedula } });
    } catch (error) {
      res.status(400).json({ mensaje: "Error en roles" });
    }

    if (roles.includes(usuario.rol)) {
      next();
    }
    return res.status(401).json("Acceso no autorizado.");
  };
};
