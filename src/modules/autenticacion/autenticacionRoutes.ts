import {Router} from "express";
import {
    registro,
    login,
    validarCorreo,
    validarNombreUsuario,
    verificarCorreo,
    confirmarCorreo,
    contrasenaOlvidada,
    restablecerContrasena
} from "./autenticacionController";

import { validate} from "../middleware/validate";

import {
    registroSchema, 
    loginSchema, 
    correoRequeridoSchema, 
    contrasenaRequeridaSchema,
    tokenRequeridoSchema
} from "./autenticacionSchema";

import { autenticacion } from "../middleware/autenticacion";

import { autorizacion } from "../middleware/autorizacion";

const router = Router();

router.post("/registro", validate([registroSchema]), registro);
router.post("/login", validate([loginSchema]), login);
router.get("/validar-correo", validate([correoRequeridoSchema]), validarCorreo);
router.get("/validar-nombre-usuario", validarNombreUsuario);
router.post("/verificar-correo", [autenticacion, validate([correoRequeridoSchema]), autorizacion(['Estándar', 'Supervisor'])], verificarCorreo);
router.get("/confirmar-correo/:token", confirmarCorreo);
router.post("/contrasena-olvidada", validate([correoRequeridoSchema]), contrasenaOlvidada);
router.post("/restablecer-contrasena/:token", validate([tokenRequeridoSchema, contrasenaRequeridaSchema]), restablecerContrasena);

export default router;