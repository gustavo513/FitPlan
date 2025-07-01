import {Router} from 'express';

import {autenticacion} from '../middleware/autenticacion';
import {autorizacion} from '../middleware/autorizacion';

import { validate } from '../middleware/validate';

import { perfilSchema } from './perfilSchema';

import {
    miPerfil,
    obtener,
    agregar,
    actualizar
} from './perfilController';

const router = Router();

router.get('/', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], miPerfil);
router.get('/obtener/:id', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], obtener);
router.post('/agregar', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], validate([perfilSchema]), agregar);
router.put('/actualizar', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], validate([perfilSchema]), actualizar);

export default router;