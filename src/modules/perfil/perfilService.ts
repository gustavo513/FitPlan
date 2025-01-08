import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function obtenerMiPerfil(idUsuario: number) {
    return await prisma.perfil.findUnique({
        where: {
            id_usuario: idUsuario
        },
        include: {
            pref_alim: true,
            afeccion: true,
        }
    });
}

export async function obtenerPerfil(
    idUsuario: number,
    idSupervisor: number
) {
    const usuario = await prisma.usuario.findUnique({
        where: {
            id_usuario: idUsuario,
            id_supervisor: idSupervisor,
            estado: 1
        }
    });

    if (!usuario) {
        throw new Error('Error al procesar solicitud');
    }

    const perfil = await prisma.perfil.findUnique({
        where: {
            id_usuario: idUsuario
        },
        include: {
            pref_alim: true,
            afeccion: true
        }
    });

    return perfil;
};

export async function agregarPerfil(
    data: {
        nombre: string,
        apellido: string,
        genero: number,
        fechaNacimiento: string,
        altura: number,
        peso: number,
        idCiudad?: number
    },
    idUsuario: string
){
    const perfil = await prisma.perfil.create({
        data: {
            ...data,
            id_usuario: parseInt(idUsuario)
        }
    });
}

export async function actualizarPerfil(
    data: {
        nombre: string,
        apellido: string,
        genero: number,
        fechaNacimiento: string,
        altura: number,
        peso: number,
        idCiudad: number
    },
    idUsuario: number
){
    const perfil = await prisma.perfil.update({
        where: {
            id_usuario: idUsuario
        },
        data: {
            ...data
        }
    });
}