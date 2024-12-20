import {Router} from "express";
import {registro, login} from "./autenticacionController";

const router = Router();

router.post("/registro", registro);
router.post("/login", login);

export default router;