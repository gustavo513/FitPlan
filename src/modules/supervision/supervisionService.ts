import { PrismaClient, SolicitudEstado } from '@prisma/client';

const prisma = new PrismaClient();

export async function listarSolicitudesSupervision(idUsuario: number) {
    
    const solicitudes = await prisma.solicitudSupervision.findMany({
        where: {
            id_supervisor: idUsuario,
            estado: 'P'
        },
        select: {
            id_solicitud: true,
            fecha: true,
            usuario: {
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

    return solicitudes;
}

export async function agregarSolicitudSupervision(idSupervisor: number, idUsuario: number) {
    
    const solicitud = await prisma.solicitudSupervision.findFirst({
        where: {
            id_usuario: idUsuario,
            id_supervisor: idSupervisor
        }
    });

    if (!solicitud) {
        return await prisma.solicitudSupervision.create({
            data: {
                id_supervisor: idSupervisor,
                id_usuario: idUsuario
            }
        });
    }
    else {
        if (solicitud.estado != 'P') {
            return await prisma.solicitudSupervision.updateMany({
                where: {
                    id_usuario: idUsuario,
                    id_supervisor: idSupervisor
                },
                data: {
                    fecha: new Date(),
                    estado: 'P'
                }
            });
        }
    }
}

export async function actualizarSolicitudSupervision(idSolicitud: number, estado: SolicitudEstado) {

    const solicitud = await prisma.solicitudSupervision.update({
        where: {
            id_solicitud: idSolicitud
        },
        data: {
            estado: estado
        }
    });

    if (estado == 'A') {

        //se verifica si ya hubo algún vínculo previo entren usuario y supervisor
        const vinculo = await prisma.usuario_Supervisor.findFirst({
            where: {
                id_estandar: solicitud.id_usuario,
                id_supervisor: solicitud.id_supervisor
            }
        });

        //si aún no existió un vínculo, entonces se establece uno, caso contrario, se actualiza el estado
        if (!vinculo) {
            await prisma.usuario_Supervisor.create({
                data: {
                    id_estandar: solicitud.id_usuario,
                    id_supervisor: solicitud.id_supervisor
                }
            });
        }
        else {
            await prisma.usuario_Supervisor.updateMany({
                where: {
                    id_estandar: solicitud.id_usuario,
                    id_supervisor: solicitud.id_supervisor
                },
                data: {
                    fecha_conexion: new Date(),
                    estado: 1
                }
            });
        }
    }

    return solicitud;
}