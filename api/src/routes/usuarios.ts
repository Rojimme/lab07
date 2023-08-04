import { Router } from 'express';
import UsuariosController from '../controller/UsuariosController';

const routes = Router();

routes.get('', UsuariosController.getAll);
routes.post('', UsuariosController.add);
routes.patch('', UsuariosController.update);
routes.delete('/:cedula', UsuariosController.delete);
export default routes;
