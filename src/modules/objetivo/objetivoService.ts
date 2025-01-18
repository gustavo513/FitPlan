import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function obtenerObjetivos() {
    
    const objetivos = await prisma.objetivo.findMany();

    return objetivos;
}