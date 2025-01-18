import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function obtenerAfecciones(cantReg: number) {
    const afecciones = await prisma.afeccion.findMany({
        skip: cantReg - 10,
        take: cantReg,
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
            descripcion: descripcion
        }
    });

    return afeccion;
}

export async function agregarAfeccion(data: { descripcion: string }, idUsuario: number) {
    
    const perfil = await prisma.perfil.findUnique({
        where: {
            id_usuario: idUsuario
        }
    });

    const afeccion = await prisma.afeccion.create({
        data: {
            ...data
        }
    });

    await prisma.perfil_Afeccion.create({
        data: {
            id_afeccion: afeccion.id_afeccion,
            id_perfil: perfil?.id_perfil!
        }
    })

    return afeccion;
}

export async function vincularAfeccionPerfil(idAfeccion: number, idUsuario: number) {
    
    const perfil = await prisma.perfil.findUnique({
        where: {
            id_usuario: idUsuario
        }
    });

    const afeccionPerfil = await prisma.perfil_Afeccion.create({
        data: {
            id_afeccion: idAfeccion,
            id_perfil: perfil?.id_perfil!
        }
    });

    return afeccionPerfil;
}

export async function desvincularAfeccionPerfil(idAfeccion: number, idPerfil: number) {
    

    const afeccionPerfil = await prisma.perfil_Afeccion.updateMany({
        where: {
            id_afeccion: idAfeccion,
            id_perfil: idPerfil,
            estado: 1
        },
        data: {
            estado: 0,
            fecha_fin: new Date(Date.now())
        }
    });

    return afeccionPerfil;

}