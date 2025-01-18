import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function obtenerSugerencias() {
    
    const sugerencias = await prisma.sugerencia.findMany();

    return sugerencias;
}

export async function agregarSugerencia(data: { comentario: string }, idUsuario: number) {
    
    const sugerencia = await prisma.sugerencia.create({
        data: {
            ...data,
            id_usuario: idUsuario
        }
    });

    return sugerencia;
}

export async function actualizarSugerencia(comentario: string, idSugerencia: number) {
    
    const sugerencia = await prisma.sugerencia.update({
        where: {
            id_sugerencia: idSugerencia
        },
        data: {
            comentario: comentario
        }
    });

    return sugerencia;
}