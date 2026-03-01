// En la carpeta utils van todas las funciones reutilizables en todo el proyecto
// Aquí se va a colocar un manejador global de excepciones comunes en todo el proyecto

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ErrorLog {
    constructor(
        readonly message: string,
        readonly errors: string,
        readonly statusCode?: number,
    ) { }


}

export const registrarError = async (error: ErrorLog) => {
    try {
        await prisma.registro_error.create({
            data: {
                status_code: error.statusCode || 0,
                message: error.message,
                errors: error.errors
            }
        });
    }
    catch (error: any) {
        throw error;
    }
}