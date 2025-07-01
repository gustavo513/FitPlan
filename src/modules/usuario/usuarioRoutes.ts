import { Router } from "express";

import {autenticacion} from '../middleware/autenticacion';
import {autorizacion} from "../middleware/autorizacion";

import {
    miUsuario,
    obtenerPorId,
    obtenerPorNombreUsuario,
    actualizar,
    actualizarContrasenia,
    eliminar,
    listarSupervisores,
    listarSupervisados,
    eliminarSupervision
} from '../usuario/usuarioController';

const router = Router();

router.get('/', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], miUsuario);
router.get('/obtener-por-id/:id', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], obtenerPorId);
router.get('/obtener-por-nombre-usuario/:nombre_usuario', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], obtenerPorNombreUsuario);
router.put('/actualizar', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], actualizar);
router.patch('/cambiar-contrasena', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], actualizarContrasenia);
router.patch('/eliminar', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], eliminar);
router.get('/supervisores', [autenticacion, autorizacion(['Estándar'])], listarSupervisores);
router.get('/usuarios-supervisados', [autenticacion, autorizacion(['Supervisor'])], listarSupervisados);
router.patch('/eliminar-supervision/:id', [autenticacion, autorizacion(['Estándar', 'Supervisor'])], eliminarSupervision);

export default router;