import { genero, PrismaClient } from '@prisma/client';
import { CreatePerfilSchema } from './dto/createPerfilSchema';
import { UpdatePerfilSchema } from './dto/updatePerfilSchema';

const prisma = new PrismaClient();

export async function obtenerMiPerfil(idUsuario: number) {
    return await prisma.perfil.findUnique({
        where: {
            id_usuario: idUsuario
        },
        include: {
            pref_alim: {
                select: {
                    prefalim: true,
                },
                where: {
                    estado: 1
                }
            },
            afeccion: {
                select: {
                    afeccion: true
                },
                where: {
                    estado: 1
                }
            },
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
    perfil_dto: CreatePerfilSchema,
    id_usuario: number
) {
    const resultado = await prisma.$transaction(async (tx) => {
        const perfil = await prisma.perfil.create({
            data: {
                nombre: perfil_dto.nombre,
                apellido: perfil_dto.apellido,
                genero: perfil_dto.genero as genero,
                fechaNacimiento: perfil_dto.fechaNacimiento,
                altura: perfil_dto.altura,
                peso: perfil_dto.peso,
                id_usuario: id_usuario
            }
        });

        const afecciones: any[] = [];
        const preferencias: any[] = [];

        if (perfil != null) {
            if (perfil_dto.afecciones.length > 0) {
                for (const item of perfil_dto.afecciones) {
                    const afeccion = await tx.perfil_Afeccion.create({
                        data: {
                            id_perfil: perfil.id_perfil,
                            id_afeccion: item.id,
                            estado: 1
                        }
                    });

                    afecciones.push(afeccion);
                }
            }

            if (perfil_dto.preferencias_alimentarias.length > 0) {
                for (const item of perfil_dto.preferencias_alimentarias) {
                    const preferencia = await tx.perfil_PrefAlim.create({
                        data: {
                            id_perfil: perfil.id_perfil,
                            id_pref_alim: item.id,
                            estado: 1
                        }
                    });

                    preferencias.push(preferencia);
                }
            }
        }

        return {
            "perfil": perfil,
            "afecciones": afecciones,
            "preferencias_alimentarias": preferencias
        }
    });

    return resultado;
}

export async function actualizarPerfil(
    perfil_dto: UpdatePerfilSchema,
    id_usuario: number
) {

    const resultado = await prisma.$transaction(async (tx) => {
        const perfil = await tx.perfil.update({
            where: {
                id_usuario: id_usuario
            },
            data: {
                nombre: perfil_dto.nombre,
                apellido: perfil_dto.apellido,
                genero: perfil_dto.genero as genero,
                fechaNacimiento: perfil_dto.fechaNacimiento,
                altura: perfil_dto.altura,
                peso: perfil_dto.peso,
            }
        });

        const afecciones = [];
        const preferencias = [];

        if (perfil != null) {
            // se activan todas las afecciones recibidas
            if (perfil_dto.afecciones != null && perfil_dto.afecciones?.length > 0) {
                for (const item of perfil_dto.afecciones) {
                    const afeccion = await tx.perfil_Afeccion.upsert({
                        where: {
                            id_perfil_id_afeccion: {
                                id_perfil: perfil.id_perfil,
                                id_afeccion: item.id
                            }
                        },
                        update: {
                            estado: 1
                        },
                        create: {
                            id_perfil: perfil.id_perfil,
                            id_afeccion: item.id,
                            estado: 1
                        }
                    });

                    afecciones.push(afeccion);
                }

                // Identificador de afecciones recibidas
                const activos = perfil_dto.afecciones.map((item) => item.id);

                // Se desactivan las afecciones no recibidas
                await tx.perfil_Afeccion.updateMany({
                    where: {
                        AND: [
                            {
                                id_afeccion: {
                                    notIn: activos
                                }
                            },
                            {
                                id_perfil: perfil.id_perfil
                            }
                        ]
                    },
                    data: {
                        estado: 0
                    }
                });
            }
            else if (perfil_dto.afecciones?.length == 0) {
                await prisma.perfil_Afeccion.updateMany({
                    where: {
                        id_perfil: perfil!.id_perfil
                    },
                    data: {
                        estado: 0
                    }
                });
            }

            if (perfil_dto.preferencias_alimentarias != null && perfil_dto.preferencias_alimentarias.length > 0) {
                // Se activan todas las preferencias alimentarias recibidas
                for (const item of perfil_dto.preferencias_alimentarias) {
                    const preferencia = await tx.perfil_PrefAlim.upsert({
                        where: {
                            id_perfil_id_pref_alim: {
                                id_perfil: perfil.id_perfil,
                                id_pref_alim: item.id
                            }
                        },
                        update: {
                            estado: 1
                        },
                        create: {
                            id_perfil: perfil.id_perfil,
                            id_pref_alim: item.id,
                            estado: 1
                        }
                    });

                    preferencias.push(preferencia);
                }

                const preferenciasActivas = perfil_dto.preferencias_alimentarias.map((item) => item.id);

                // Se desactivan las preferencias alimentarias no recibidas
                await tx.perfil_PrefAlim.updateMany({
                    where: {
                        AND: [
                            {
                                id_pref_alim: {
                                    notIn: preferenciasActivas
                                }
                            },
                            {
                                id_perfil: perfil.id_perfil
                            }
                        ]
                    },
                    data: {
                        estado: 0
                    }
                });
            }
        }

        return {
            ...perfil,
            "fecha_nacimiento": perfil.fechaNacimiento,
            "afecciones": afecciones,
            "preferencias": preferencias
        }

    });

    return resultado;

}