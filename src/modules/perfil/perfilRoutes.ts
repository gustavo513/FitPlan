import {Router} from 'express';

import {autenticacion} from '../middleware/autenticacion';
import {autorizacion} from '../middleware/autorizacion';

import {
    miPerfil,
    obtener,
    agregar,
    actualizar
} from './perfilController';

const router = Router();

router.get('/', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], miPerfil);
router.get('/obtener/:id', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], obtener);
router.post('/agregar', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], agregar);
router.put('/actualizar', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], actualizar);

export default router;