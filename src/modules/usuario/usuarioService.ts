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
            id_rol: true
        }        
    });

    return usuario;
}

export async function obtenerUsuarioPorId(idUsuario: number){
    const usuario = await prisma.usuario.findUnique({
        where: {
            id_usuario: idUsuario,
            estado: 1 //usuario activo
        },
        select: {
            id_usuario: true,
            nombre_usuario: true,
            fecha_creacion: true,
            estado: true,
            id_rol: true,
            perfil: {
                select: {
                    id_perfil: true,
                    nombre: true,
                    apellido: true
                }
            }
        }
    });

    return usuario;
};

export async function obtenerUsuarioPorNombreUsuario(nombre_usuario: string) {
    const usuario = await prisma.usuario.findUnique({
        where: {
            nombre_usuario: nombre_usuario,
            estado: 1
        },
        
        select: {
            id_usuario: true,
            nombre_usuario: true,
            fecha_creacion: true,
            estado: true,
            id_rol: true,
            perfil: {
                select: {
                    id_perfil: true,
                    nombre: true,
                    apellido: true
                }
            }
        }
    });

    return usuario;
}

export async function actualizarUsuario(
    data: {
        email: string,
        nombre_usuario: string,
        estado: number
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

export async function cambiarContrasenia(contrasenia: string, contraseniaNueva: string, idUsuario: number){
    
    const usuario = await prisma.usuario.findUnique({
        where: {
            id_usuario: idUsuario,
            contrasenia: await bcrypt.hash(contrasenia, 10),
            estado: 1
        }
    })
    
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

export async function eliminarUsuario(idUsuario: number, rol: string) {
    
    //establecer los campos nombre y apellido a null en Perfil
    await prisma.perfil.update({
        where: {
            id_usuario: idUsuario
        },
        data: {
            nombre: null,
            apellido: null
        }
    });

    //verificar y eliminar métodos de autenticación de usuario
    const metAut = await prisma.metodoAut.findFirst({
        where: {
            id_usuario: idUsuario
        }
    });

    if (metAut) {
        await prisma.metodoAut.deleteMany({
            where: {
                id_usuario: idUsuario
            }
        });
    }

    //por último, establecer estado a 0 y email y nombre_usuario a null
    return await prisma.usuario.update({
        where: {
            id_usuario: idUsuario
        },
        data: {
            estado: 0,
            email: null,
            nombre_usuario: null,
            contrasenia: null,
            fecha_eliminacion: new Date()
        }
    });
};

export async function listarUsuariosSupervisores(idUsuario: number) {
    const supervisores = await prisma.usuario_Supervisor.findMany({
        where: {
            id_estandar: idUsuario,
            supervisores: {
                estado: 1
            }
        },
        include: {
            supervisores: {
                select: {
                    id_usuario: true,
                    nombre_usuario: true,
                    perfil: {
                        select: {
                            id_perfil: true,
                            nombre: true,
                            apellido: true
                        }
                    }
                }
            }
        }
    });

    return supervisores;
}

export async function listarUsuariosSupervisados(idUsuarioSupervisor: number){
    const usuarios = await prisma.usuario_Supervisor.findMany({
        where: {
            id_supervisor: idUsuarioSupervisor,
            supervisados: {
                estado: 1
            }
        },
        include: {
            supervisados: {
                select: {
                    id_usuario: true,
                    nombre_usuario: true,
                    perfil: {
                        select: {
                            id_perfil: true,
                            nombre: true,
                            apellido: true
                        }
                    }
                }
            }
        }
    });
        
    return usuarios;
};

export async function eliminarUsuarioSupervisor(idUsuarioActual: number, id: number, rol: string) {

    let idUsuarioEstandar;
    let idUsuarioSupervisor;

    if (rol == 'Estándar') {
        idUsuarioEstandar = idUsuarioActual;
        idUsuarioSupervisor = id;
    }
    else {
        idUsuarioEstandar = id;
        idUsuarioSupervisor = idUsuarioActual;
    }

    await prisma.usuario_Supervisor.deleteMany({
        where: {
            id_estandar: idUsuarioEstandar,
            id_supervisor: idUsuarioSupervisor
        }
    });
}