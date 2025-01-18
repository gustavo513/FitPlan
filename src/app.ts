import express from "express";
import passport from "passport";
import dotenv from "dotenv";

import autenticacionRouter from "./modules/autenticacion/autenticacionRoutes";
import "./modules/autenticacion/passportGoogle";
import autenticacionGoogleRouter from "./modules/autenticacion/autenticacionGoogleRoutes";
import usuarioRouter from "./modules/usuario/usuarioRoutes";
import perfilRouter from "./modules/perfil/perfilRoutes";
import solicitudSupervisionRouter from './modules/supervision/supervisionRoutes';
import sugerenciaRouter from './modules/sugerencia/sugerenciaRoutes';

//carga las variables del archivo .env
dotenv.config();

//inicializar express
const app = express();

app.use(express.json());
app.use(passport.initialize()); //inicializar passport

app.get("/healthcheck", (req, res) => {
    res.json('La API de FitPlan está en ejecución...');
});

app.use('/autenticacion', autenticacionRouter);
app.use('/autenticacion', autenticacionGoogleRouter);
app.use('/perfil', perfilRouter);
app.use('/usuario', usuarioRouter);
app.use('/solicitudes-supervision', solicitudSupervisionRouter);
app.use('/sugerencia', sugerenciaRouter);

app.listen(3000, "0.0.0.0", () => {
    console.log("El servidor se está ejecutando en el puerto 3000");
});