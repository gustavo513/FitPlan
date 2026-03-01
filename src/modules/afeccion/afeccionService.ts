import { Afeccion, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function formatearDescripcion(descripcion: string) {

    descripcion = descripcion.trim();

    descripcion = descripcion.toLowerCase();

    descripcion = descripcion.charAt(0).toUpperCase() + descripcion.slice(1);

    return descripcion;
}

export async function obtenerAfecciones(cantReg: number) {
    const afecciones = await prisma.afeccion.findMany({
        skip: cantReg - 15,
        take: 15,
        select: {
            id_afeccion: true,
            descripcion: true
        }
    });

    return afecciones;
}

export async function obtenerAfeccionPorDescripcion(descripcion: string) {

    const afeccion = await prisma.afeccion.findMany({
        where: {
            OR: [
                { descripcion: { contains: descripcion, mode: 'insensitive' } },
                { descripcion: { startsWith: descripcion, mode: 'insensitive' } },
                { descripcion: { endsWith: descripcion, mode: 'insensitive' } }
            ]
        }
    });

    return afeccion;
}

export async function agregarAfeccion(data: { descripcion: string }, idUsuario: number) {

    /* const perfil = await prisma.perfil.findUnique({
        where: {
            id_usuario: idUsuario
        }
    }); */

    data.descripcion = formatearDescripcion(data.descripcion);

    const afeccion = await prisma.afeccion.upsert({
        where: {
            descripcion: data.descripcion
        },
        update: {
            descripcion: data.descripcion
        },
        create: {
            ...data
        }
    });

    /* await prisma.perfil_Afeccion.create({
        data: {
            id_afeccion: afeccion.id_afeccion,
            id_perfil: perfil?.id_perfil!
        }
    }); */

    return afeccion;

}

export async function vincularAfeccionPerfil(afecciones: number[], id_perfil: number) {

    const resultado = await prisma.$transaction(async (tx) => {
        return await tx.perfil_Afeccion.updateMany({
            where: {
                id_perfil: id_perfil,
                id_afeccion: {
                    in: afecciones,
                },
            },
            data: {
                estado: 1,
                fecha_actualizacion: new Date(),
            },
        });
    });

    //return { estado: resultado.count };
    return resultado;

}

export async function desvincularAfeccionPerfil(id_perfil: number, afecciones: number[]) {

    const resultado = await prisma.$transaction(async (tx) => {
        return await tx.perfil_Afeccion.updateMany({
            where: {
                id_perfil: id_perfil,
                estado: 1,
                id_afeccion: {
                    in: afecciones,
                },
            },
            data: {
                estado: 0,
                fecha_actualizacion: new Date(),
            },
        });
    });

    return { estado: resultado.count };

}