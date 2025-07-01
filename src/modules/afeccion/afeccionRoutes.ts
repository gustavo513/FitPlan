import { Router } from 'express';
import { validate } from '../middleware/validate';
import { afeccionSchema } from './afeccionSchema';

import {
    agregar,
    obtener,
    obtenerPorDescripcion,
    vincular,
    desvincular
} from './afeccionController';

import { autenticacion } from '../middleware/autenticacion';
import { autorizacion } from '../middleware/autorizacion';

const routes = Router();

routes.get('/listar/:cantReg', [autenticacion, autorizacion(['Estándar'])], obtener);
routes.get('/obtener-por-descripcion', [autenticacion, autorizacion(['Estándar'])], obtenerPorDescripcion);
routes.post('/agregar', [autenticacion, autorizacion(['Estándar'])], validate([afeccionSchema]), agregar);
routes.post('/vincular/:id', [autenticacion, autorizacion(['Estándar'])], vincular);
routes.put('/desvincular/:idPerfil/:idAfeccion', desvincular); 

export default routes;