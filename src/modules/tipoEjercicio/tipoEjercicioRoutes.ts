import { Router } from 'express';

import { autenticacion } from '../middleware/autenticacion';
import { autorizacion } from '../middleware/autorizacion';
import { listar } from './tipoEjericioController';

const routes = Router();

routes.get('/', [autenticacion, autorizacion(['Estándar']), listar]);

export default routes;