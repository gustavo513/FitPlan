import {Router} from "express";
import {
    registro,
    login,
    validarCorreo,
    validarNombreUsuario,
    verificarCorreo,
    confirmarCorreo,
    contraseniaOlvidada,
    restablecerContrasenia
} from "./autenticacionController";

import { validate} from "../middleware/validate";

import {registroSchema, loginSchema} from "./autenticacionSchema";

import { autenticacion } from "../middleware/autenticacion";

import { autorizacion } from "../middleware/autorizacion";

const router = Router();

router.post("/registro", validate(registroSchema), registro);
router.post("/login", validate(loginSchema), login);
router.get("/validar-correo", validarCorreo);
router.get("/validar-nombre-usuario", validarNombreUsuario);
router.post("/verificar-correo", [autenticacion, autorizacion(['Estándar', 'Supervisor'])], verificarCorreo);
router.get("/confirmar-correo/:token", confirmarCorreo);
router.post("/contrasenia-olvidada", contraseniaOlvidada);
router.post("/restablecer-contrasenia/:token", restablecerContrasenia);

export default router;