import { Request, Response } from 'express';

import {
    obtenerPrefAlimentarias,
    vincularPrefAlim,
    desvincularPrefAlim
} from './prefAlimService';

export async function listar(req: Request, res: Response) {
    try {
        
        const prefAlims = await obtenerPrefAlimentarias();

        return res.status(200).send(prefAlims);
    }
    catch (error: any) {
        return res.status(404).send({ message: 'No se han encontrdo registros', error: error.message });
    }
}

export async function vincular(req: Request, res: Response) {
    try {
        const idUsuario = res.locals.user;

        const idPrefAlim = parseInt(req.params.id);

        const prefAlim = await vincularPrefAlim(idPrefAlim, idUsuario);

        return res.status(200).send(prefAlim);
    }
    catch (error: any) {
        return res.status(400).send({ message: 'Error al intentar agregar preferencia alimentaria', error: error.message });
    }
}

export async function desvincular(req: Request, res: Response) {
    try {
        
        const idPerfil = parseInt(req.params.idPerfil);

        const idPrefAlim = parseInt(req.params.idPrefAlim);

        const prefAlim = await desvincularPrefAlim(idPrefAlim, idPerfil);

        return res.status(200).send(prefAlim);
    }
    catch (error: any) {
        return res.status(400).send({ message: 'Error al intentar quitar preferencia alimentaria', error: error.message });
    }
}