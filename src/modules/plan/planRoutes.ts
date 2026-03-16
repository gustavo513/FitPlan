import { Router } from "express";
import { autenticacion } from "../middleware/autenticacion";
import { autorizacion } from "../middleware/autorizacion";
import { validate } from "../middleware/validate";
import { createPlanSchema } from "./dto/createPlanSchema";
import { generarPlanController } from "./planController";

const route = Router();

route.post('/generar-plan', [autenticacion, autorizacion(['Estándar'])], validate([createPlanSchema]), generarPlanController);

export default route;