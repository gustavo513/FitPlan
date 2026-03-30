import { Router } from 'express';

import { autenticacion } from '../middleware/autenticacion';
import { autorizacion } from '../middleware/autorizacion';

import { validate } from '../middleware/validate';

import { createPerfilSchema } from './dto/createPerfilSchema';
import { updatePerfilSchema } from './dto/updatePerfilSchema';

import {
    actualizar,
    agregar,
    miPerfil,
    obtener
} from './perfilController';

const router = Router();

router.get('/', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], miPerfil);
router.get('/obtener/:id', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], obtener);
router.post('/agregar', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], validate([createPerfilSchema]), agregar);
router.post('/actualizar', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], validate([updatePerfilSchema]), actualizar);

export default router;