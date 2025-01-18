import { Router } from 'express';

import {
    listar
} from './objetivoController';

import { autenticacion } from '../middleware/autenticacion';
import { autorizacion } from '../middleware/autorizacion';

const routes = Router();

routes.get('/', [autenticacion, autorizacion(['Estándar'])], listar);

export default routes;