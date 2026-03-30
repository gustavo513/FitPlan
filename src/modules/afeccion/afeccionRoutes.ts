import { Router } from 'express';
import { validate } from '../middleware/validate';

import {
    agregar,
    obtener,
    obtenerPorDescripcion,
    vincular,
    desvincular
} from './afeccionController';

import { autenticacion } from '../middleware/autenticacion';
import { autorizacion } from '../middleware/autorizacion';
import { afeccionSchema } from './afeccionSchema';

const routes = Router();

routes.get('/listar/:cantReg', [autenticacion, autorizacion(['Estándar'])], obtener);
routes.get('/obtener-por-descripcion', [autenticacion, autorizacion(['Estándar'])], obtenerPorDescripcion);
routes.post('/agregar', /*[autenticacion, autorizacion(['Estándar'])],*/ validate([afeccionSchema]), agregar);
routes.post('/vincular', [autenticacion, autorizacion(['Estándar'])], vincular);
routes.post('/desvincular', [autenticacion, autorizacion(['Estándar'])], desvincular);

export default routes;