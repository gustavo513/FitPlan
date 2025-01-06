import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function obtenerPerfil(
    idUsuario: number
){
    const perfil = await prisma.perfil.findUnique({
        where: {
            id_usuario: idUsuario
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
    idUsuario: string,
    idPerfil: string,
){
    const perfil = await prisma.perfil.update({
        where: {
            id_usuario: parseInt(idUsuario),
            id_perfil: parseInt(idPerfil)
        },
        data: {
            ...data
        }
    });
}