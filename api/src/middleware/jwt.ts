import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export const checkjwt = (req: Request, res: Response, next: NextFunction) => {
  const token = <string>req.headers["token"];

  if (!token) {
    res.status(401).json("Acceso no autorizado.");
  }
  let payload;
  try {
    payload = jwt.verify(token, "utnKey1234");
    res.locals.payload = payload;
  } catch (error) {
    res.status(401).json("Acceso no autorizado.");
  }

  const { cedula } = payload;
  const tokenNew = jwt.sign({ cedula }, "utnKey1234", { expiresIn: "5m" });
  res.setHeader("token", tokenNew);

  next();
};
