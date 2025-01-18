import { Request, Response } from 'express';

import {
    obtenerObjetivos
} from './objetivoService';

export async function listar(req: Request, res: Response) {
    try {
        
        const objetivos = await obtenerObjetivos();

        return res.status(200).send(objetivos);
    }
    catch (error: any) {
        return res.status(400).send({ message: 'No se han encontrado registros', error: error.message });
    }
}