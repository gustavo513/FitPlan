import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function formatearDescripcion(descripcion: string){

    descripcion = descripcion.trim();

    descripcion = descripcion.toLowerCase();

    descripcion = descripcion.charAt(0).toUpperCase() + descripcion.slice(1);

    return descripcion;
}

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
            descripcion: {
                contains: descripcion.toLowerCase(),
                mode: 'insensitive'
            }
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

    data.descripcion = formatearDescripcion(data.descripcion);

    // Verificar que no exista otro registro con la misma descripción. Si ya existe, entonces solamente vincular con el perfil de usuario
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

    // Cambiar a update en vez de create
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