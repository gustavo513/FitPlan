import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function obtenerTiposEjercicios() {
    
    const tiposEjercicios = await prisma.tipoEjercicio.findMany();

    return tiposEjercicios;
}