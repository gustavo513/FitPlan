import express from "express";
import dotenv from "dotenv";

import autenticacionRouter from "./modules/autenticacion/autenticacionRoutes";

//carga las variables del archivo .env
dotenv.config();

const app = express();

app.use(express.json());

app.get("/healthcheck", (req, res) => {
    res.json('La API de FitPlan está en ejecución...');
});

app.use('/autenticacion', autenticacionRouter);

app.listen(3000, "0.0.0.0", () => {
    console.log("El servidor se está ejecutando en el puerto 3000");
});