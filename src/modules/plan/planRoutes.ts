import { Router } from "express";
import { autenticacion } from "../middleware/autenticacion";
import { autorizacion } from "../middleware/autorizacion";
import { validate } from "../middleware/validate";
import { createPlanSchema } from "./dto/createPlanSchema";
import { actualizarPlanController, generarPlanController, obtenerPlanActualController } from "./planController";

const route = Router();

route.post('/generar-plan', [autenticacion, autorizacion(['Estándar'])], validate([createPlanSchema]), generarPlanController);
route.get('/obtener-plan', [autenticacion, autorizacion(['Estándar'])], obtenerPlanActualController);
route.put('/actualizar-plan', [autenticacion, autorizacion(['Estándar'])], actualizarPlanController);

export default route;