import {Router} from 'express';

import {autenticacion} from '../middleware/autenticacion';
import {autorizacion} from '../middleware/autorizacion';

import {
    obtener,
    agregar,
    actualizar
} from './perfilController';

const router = Router();

router.get('/', [autenticacion, autorizacion(['Estándar'])], obtener);
router.post('/', [autenticacion, autorizacion(['Estándar'])], agregar);
router.put('/:id', [autenticacion, autorizacion(['Estándar'])], actualizar);

export default router;