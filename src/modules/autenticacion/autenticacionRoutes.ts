import {Router} from "express";
import {
    registro,
    login,
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
router.post("/verificar-correo", [autenticacion, autorizacion(['Estándar', 'Supervisor'])], verificarCorreo);
router.post("/confirmar-correo/:token", confirmarCorreo);
router.post("/contrasenia-olvidada", contraseniaOlvidada);
router.post("/restablecer-contrasenia/:token", restablecerContrasenia);

export default router;