import { Router } from "express";

import {autenticacion} from '../middleware/autenticacion';
import {autorizacion} from "../middleware/autorizacion";

import {
    obtener,
    actualizar,
    actualizarContrasenia,
    eliminar,
    listarUsSup
} from '../usuario/usuarioController';

const router = Router();

router.get('/:id', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], obtener);
router.put('/actualizar', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], actualizar);
router.patch('/cambiar-contrasenia', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], actualizarContrasenia);
router.delete('/eliminar', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], eliminar);
router.get('/', [autenticacion, autorizacion(['Supervisor'])], listarUsSup);

export default router;