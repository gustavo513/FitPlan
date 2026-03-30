import { Router } from "express";
import { autenticacion } from "../middleware/autenticacion";
import { autorizacion } from "../middleware/autorizacion";

import { validate } from "../middleware/validate";
import { updateIngredienteSchema } from "./dto/updateIngredienteSchema";
import { sustituirIngredienteController } from "./ingredienteController";

const route = Router();

route.post('/sustituir-ingrediente-plan', [autenticacion, autorizacion(['Estándar'])], validate([updateIngredienteSchema]), sustituirIngredienteController);

export default route;