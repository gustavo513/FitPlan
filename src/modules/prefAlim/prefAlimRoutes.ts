import { Router } from 'express';

import {
    listar,
    vincular,
    desvincular
} from './prefAlimController';

import { autenticacion } from '../middleware/autenticacion';
import { autorizacion } from '../middleware/autorizacion';

const routes = Router();

routes.get('/', [autenticacion, autorizacion(['Estándar'])], listar);
routes.post('/vincular/:id', [autenticacion, autorizacion(['Estándar'])], vincular);
routes.put('/desvincular/:idPerfil/:idPrefAlim', [autenticacion, autorizacion(['Estándar'])], desvincular);

export default routes;