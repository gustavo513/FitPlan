import { Request, Response } from 'express';

import {
    agregarSugerencia,
    obtenerSugerencias,
    actualizarSugerencia
} from './sugerenciaService';

export async function agregar(req: Request, res: Response) {
    try {
        
        const { comentario } = req.body;

        const idUsuario = res.locals.user;

        const sugerencia = await agregarSugerencia({ comentario }, idUsuario);

        res.status(201).send(sugerencia);
    }
    catch (error: any) {
        res.status(400).send({ message: 'Registro fallido', error: error.message });
    }
}

export async function listar(req: Request, res: Response) {
    try {
        
        const sugerencias = await obtenerSugerencias();

        return res.status(200).send(sugerencias);
    }
    catch (error: any) {
        return res.status(404).send({ message: 'Registros no encontrados', error: error.message });
    }
}

export async function actualizar(req: Request, res: Response) {
    try {
        
        const id = parseInt(req.params.id);

        const { comentario } = req.body;

        const sugerencia = await actualizarSugerencia(comentario, id);

        return res.status(200).send(sugerencia);
    }
    catch(error: any){
        return res.status(400).send({ message: 'Error al intentar actualizar el registro', error: error.message });
    }
}