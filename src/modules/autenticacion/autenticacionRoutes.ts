import {Router} from "express";
import {registro, login} from "./autenticacionController";

import { validate} from "../middleware/validate";

import {registroSchema, loginSchema} from "./autenticacionSchema";

const router = Router();

router.post("/registro", validate(registroSchema), registro);
router.post("/login", validate(loginSchema), login);

export default router;