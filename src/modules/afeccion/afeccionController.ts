import { Request, Response } from 'express';

import {
    agregarAfeccion,
    desvincularAfeccionPerfil,
    obtenerAfecciones,
    obtenerAfeccionPorDescripcion,
    vincularAfeccionPerfil,
} from './afeccionService';
import { AfeccionSchemaBody } from './afeccionSchema';

function formatearDescripcion(descripcion: string) {

    descripcion = descripcion.trim().toLowerCase();
}

export async function obtener(req: Request, res: Response) {
    try {
        const cantReg = parseInt(req.params.cantReg);

        const afecciones = await obtenerAfecciones(cantReg);

        return res.status(200).send(afecciones);
    }
    catch (error: any) {
        return res.status(404).send({ message: 'Registros no encontrados', error: error.message });
    }
}

export async function obtenerPorDescripcion(req: Request, res: Response) {
    try {
        const descripcion = req.body.descripcion;

        if (descripcion != '') {
            const afeccion = await obtenerAfeccionPorDescripcion(descripcion);
            return res.status(200).send(afeccion);
        }
    }
    catch (error: any) {
        return res.status(404).send({ message: 'Registro no encontrado', error: error.message });
    }
}

export async function agregar(req: Request<{}, {}, AfeccionSchemaBody>, res: Response) {
    try {
        const idUsuario = res.locals.user;

        let { descripcion } = req.body;



        const afeccion = await agregarAfeccion({ descripcion }, idUsuario);

        return res.status(200).send(afeccion);
    }
    catch (error: any) {
        return res.status(400).send({ message: 'No se pudo completar el registro', error: error.message });
    }
}

export async function vincular(req: Request, res: Response) {
    try {

        const id_perfil = req.body.id_perfil;

        const afecciones = req.body.afecciones;

        const afeccion = await vincularAfeccionPerfil(afecciones, id_perfil);

        return res.status(200).send(afeccion);
    }
    catch (error: any) {
        return res.status(400).send({ message: 'Error al intentar agregar afección', error: error.message });
    }
}

export async function desvincular(req: Request, res: Response) {
    try {
        const id_perfil = parseInt(req.body.id_perfil);

        const afecciones = req.body.afecciones;

        const resultado = await desvincularAfeccionPerfil(id_perfil, afecciones);

        return res.status(200).send(resultado);
    }
    catch (error: any) {
        return res.status(400).send({ message: 'Error al intentar quitar afeccion', error: error.message });
    }
}