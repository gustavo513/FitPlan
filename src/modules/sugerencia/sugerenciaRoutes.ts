import { Router } from 'express';
import { listar, agregar, actualizar } from './sugerenciaController';
import { autenticacion } from '../middleware/autenticacion';
import { autorizacion } from '../middleware/autorizacion';

const routes = Router();

routes.get('/', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], listar);
routes.post('/agregar', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], agregar);
routes.put('/actualizar/:id', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], actualizar);

export default routes;