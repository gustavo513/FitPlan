import { Router } from "express";

import {
    listar,
    agregar,
    actualizar
} from './supervisionController';

import { autenticacion } from "../middleware/autenticacion";

import { autorizacion } from "../middleware/autorizacion";

const routes = Router();

routes.get('/', [autenticacion, autorizacion(['Supervisor'])], listar);
routes.post('/agregar/:idSupervisor', [autenticacion, autorizacion(['Estándar'])], agregar);
routes.put('/actualizar/:id', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], actualizar);

export default routes;