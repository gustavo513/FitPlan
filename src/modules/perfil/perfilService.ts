import {genero, PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function obtenerMiPerfil(idUsuario: number) {
    return await prisma.perfil.findUnique({
        where: {
            id_usuario: idUsuario
        },
        include: {
            ciudad: {
                select: {
                    nombre: true,
                    region: {
                        select: {
                            nombre: true,
                            pais: {
                                select: {
                                    nombre: true
                                }
                            }
                        }
                    }
                }
            },
            pref_alim: {
                select: {
                    estado: true,
                    prefalim: true
                }
            },
            afeccion: {
                select: {
                    estado: true,
                    afeccion: true
                }
            }
        }
    });
}

export async function obtenerPerfil(
    idPerfil: number,
    idUsuarioActual: number,
    rol: string
) {

    let idUsuarioEstandar;
    let idSupervisor;

    const idUsuario = await prisma.perfil.findUnique({
        where: {
            id_perfil: idPerfil
        },
        select: {
            id_usuario: true
        }
    });

    if (rol == 'Estándar') {
        idUsuarioEstandar = idUsuarioActual;
        idSupervisor = idUsuario?.id_usuario;
    }
    else {
        idUsuarioEstandar = idUsuario?.id_usuario;
        idSupervisor = idUsuarioActual;
    }

    //Los supervisores pueden ver solamente los perfiles de los usuarios que supervisan, por lo tanto, se verifica previamente si el perfil a visualizar pertenece a un usuario supervisado por el usuario autenticado actualmente. El perfil a visualizar debe pertenecer a un usuario "activo"
    const usuario = await prisma.usuario_Supervisor.findFirst({
        where: {
            id_estandar: idUsuarioEstandar,
            id_supervisor: idSupervisor,
            estado: 1,
            supervisados: {
                estado: 1
            }
        }
    });

    if (!usuario) {
        throw new Error('Error al procesar solicitud');
    }
    else {

        let perfil;

        if (rol == 'Estándar') {
            perfil = await prisma.perfil.findUnique({
                where: {
                    id_perfil: idPerfil
                },
                select: {
                    id_perfil: true,
                    nombre: true,
                    apellido: true,
                    genero: true,
                    ciudad: {
                        select: {
                            nombre: true,
                            region: {
                                select: {
                                    nombre: true,
                                    pais: {
                                        select: {
                                            nombre: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    id_usuario: true
                }
            });
        }
        else {
            perfil = await prisma.perfil.findUnique({
                where: {
                    id_perfil: idPerfil
                },
                include: {
                    ciudad: {
                        select: {
                            nombre: true,
                            region: {
                                select: {
                                    nombre: true,
                                    pais: {
                                        select: {
                                            nombre: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    pref_alim: {
                        select: {
                            estado: true,
                            prefalim: true
                        }
                    },
                    afeccion: {
                        select: {
                            estado: true,
                            afeccion: true
                        }
                    }
                }
            });
        }
        return perfil;
    }
};

export async function agregarPerfil(
    data: {
        nombre: string,
        apellido: string,
        genero: string,
        fechaNacimiento: string,
        altura: number,
        peso: number,
        id_ciudad?: number | undefined
    },
    id_usuario: string
){
    const perfil = await prisma.perfil.create({
        data: {
            ...data,
            genero: data.genero as genero,
            id_usuario: parseInt(id_usuario)
        }
    });

    return perfil;
}

export async function actualizarPerfil(
    data: {
        nombre: string,
        apellido: string,
        genero: string,
        fechaNacimiento: string,
        altura: number,
        peso: number,
        id_ciudad?: number | undefined
    },
    id_usuario: number
){
    const perfil = await prisma.perfil.update({
        where: {
            id_usuario: id_usuario
        },
        data: {
            ...data,
            genero: data.genero as genero,
        }
    });

    return perfil;
}