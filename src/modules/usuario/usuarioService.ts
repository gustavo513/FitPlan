import {PrismaClient} from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function obtenerMiUsuario(idUsuario: number){
    const usuario = await prisma.usuario.findUnique({
        where: {
            id_usuario: idUsuario
        },
        select: {
            id_usuario: true,
            email: true,
            nombre_usuario: true,
            fecha_creacion: true,
            estado: true,
            id_rol: true,
            id_supervisor: true
        }        
    });

    return usuario;
}

export async function obtenerUsuario(idUsuario: number){
    const usuario = await prisma.usuario.findUnique({
        where: {
            id_usuario: idUsuario,
            estado: 1 //usuario activo
        },
        select: {
            id_usuario: true,
            email: true,
            nombre_usuario: true,
            fecha_creacion: true,
            estado: true,
            id_rol: true,
            id_supervisor: true
        }
    });

    return usuario;
};

export async function actualizarUsuario(
    data: {
        email: string,
        nombre_usuario: string,
        idRol: number,
        idSupervisor: number
    },
    idUsuario: number
){
    const usuario = await prisma.usuario.update({
        where: {
            id_usuario: idUsuario
        },
        data: {
            ...data
        }
    });
};

export async function cambiarContrasenia(contrasenia: string, idUsuario: number){
    const contrasenia_hashed = await bcrypt.hash(contrasenia, 10);
    
    return await prisma.usuario.update({
        where: {
            id_usuario: idUsuario
        },
        data: {
            contrasenia: contrasenia_hashed
        }
    });
};

export async function eliminarUsuario(idUsuario: number){
    return await prisma.usuario.update({
        where: {
            id_usuario: idUsuario
        },
        data: {
            estado: 0
        }
    });
};

export async function listarUsuariosSupervisados(idUsuarioSupervisor: number){
    const usuarios = await prisma.usuario.findMany({
        where: {
            id_supervisor: idUsuarioSupervisor,
            estado: 1 //usuarios activos
        },
        select: {
            id_usuario: true,
            perfil: {
                select: {
                    id_perfil: true,
                    nombre: true,
                    apellido: true
                }
            }
        }
    });

    return usuarios;
};