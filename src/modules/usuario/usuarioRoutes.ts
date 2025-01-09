import { Router } from "express";

import {autenticacion} from '../middleware/autenticacion';
import {autorizacion} from "../middleware/autorizacion";

import {
    miUsuario,
    obtener,
    actualizar,
    actualizarContrasenia,
    eliminar,
    listarUsSup
} from '../usuario/usuarioController';

const router = Router();

router.get('/', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], miUsuario);
router.get('/obtener/:id', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], obtener);
router.put('/actualizar', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], actualizar);
router.patch('/cambiar-contrasenia', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], actualizarContrasenia);
router.patch('/eliminar', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], eliminar);
router.get('/usuarios-supervisados', [autenticacion, autorizacion(['Supervisor'])], listarUsSup);

export default router;