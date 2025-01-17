import { Request, Response } from 'express';

import {
    listarSolicitudesSupervision,
    agregarSolicitudSupervision,
    actualizarSolicitudSupervision
} from './supervisionService';

export async function listar(req: Request, res: Response) {
    try {
        
        const idUsuario = res.locals.user;

        const solicitudes = await listarSolicitudesSupervision(idUsuario);

        return res.status(200).send(solicitudes);
    }
    catch (error: any) {
        return res.status(404).send({ message: 'No se encontraron solicitudes', error: error.message });
    }
}

export async function agregar(req: Request, res: Response) {
    try {
        
        const idSupervisor = parseInt(req.params.idSupervisor);

        const idUsuario = res.locals.user;

        const solicitud = await agregarSolicitudSupervision(idSupervisor, idUsuario);

        return res.status(200).send(solicitud);
    }
    catch (error: any) {
        return res.status(400).send({ message: 'Error al intentar enviar solicitud', error: error.message });
    }
}

export async function actualizar(req: Request, res: Response) {
    try {
        
        const idSolicitud = parseInt(req.params.id);

        const estado = req.body.estado;

        const solicitud = await actualizarSolicitudSupervision(idSolicitud, estado);

        return res.status(200).send(solicitud);
    }
    catch (error: any) {
        return res.status(400).send({ message: 'Error al procesar solicitud', error: error.message });
    }
}