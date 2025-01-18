import { Request, Response } from 'express';

import {
    obtenerTiposEjercicios
} from './tipoEjercicioService';

export async function listar(req: Request, res: Response) {
    try {
        
        const tiposEjercicios = await obtenerTiposEjercicios();

        return res.status(200).send(tiposEjercicios);
    }
    catch (error: any) {
        return res.status(404).send({ message: 'No se han encontrado registros', error: error.message });
    }
}