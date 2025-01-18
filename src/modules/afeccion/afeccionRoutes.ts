import { Router } from 'express';

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
routes.post('/agregar', [autenticacion, autorizacion(['Estándar'])], agregar);
routes.post('/vincular/:id', [autenticacion, autorizacion(['Estándar'])], vincular);
routes.put('/desvincular/:idPerfil/:idAfeccion', desvincular);

export default routes;