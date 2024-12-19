import express from "express";

const app = express();

app.use(express.json());

app.get("/healthcheck", (req, res) => {
    res.json('La API de FitPlan está en ejecución...');
});

app.listen(3000, "0.0.0.0", () => {
    console.log("El servidor se está ejecutando en el puerto 3000");
});