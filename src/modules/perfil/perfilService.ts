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

    //Los supervisores pueden ver solamente los perfiles de los usuarios que supervisan, por lo tanto, se verifica previamente si el perfil a visualizar pertenece a un usuario supervisado por el usuario autenticado actualmente. El perfil a visualizar debe pertenecer a un usuario "activo"
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