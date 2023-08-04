import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Producto } from './entity/Producto';
import { Usuario } from './entity/Usuario';
import { Persona } from './entity/Persona';
import { Cliente } from './entity/Cliente';
import { TipoCliente } from './entity/TipoCliente';
import { Factura } from './entity/Factura';
import { DetalleFactura } from './entity/DetalleFactura';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'lab07',
  synchronize: true,
  logging: false,
  entities: [
    Producto,
    Usuario,
    Persona,
    Cliente,
    TipoCliente,
    Factura,
    DetalleFactura,
  ],
  migrations: [],
  subscribers: [],
});
