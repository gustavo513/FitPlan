import {Request, Response} from 'express';
import { 
    obtenerMiPerfil,
    obtenerPerfil,
    agregarPerfil,
    actualizarPerfil
} from './perfilService';

export async function miPerfil(req: Request, res: Response) {
    try {
        const idUsuario = res.locals.user;   

        const usuario = await obtenerMiPerfil(idUsuario);

        return res.status(200).send(usuario);
    }
    catch (error: any) {
        return res.status(404).send({ message: 'Registro no encontrado', error: error.message });
    }
}

export async function obtener(req: Request, res: Response){
    try{
        const idPerfil = parseInt(req.params.id);

        const idUsuario = res.locals.user;

        const perfil = await obtenerPerfil(idPerfil, idUsuario, res.locals.role);

        res.status(200).send(perfil);
    }
    catch(error: any){
        res.status(404).send({message: 'Registro no encontrado', error: error.message})
    }
}

export async function agregar(req: Request, res: Response){

    const idUsuario = res.locals.user;

    try{
        const perfil = await agregarPerfil(req.body, idUsuario);

        return res.status(201).send(perfil);
    }
    catch(error: any){
        res.status(400).send({message: 'Registro fallido', error: error.message});
    }
};

export async function actualizar(req: Request, res: Response){

    const idUsuario = res.locals.user;

    try{
        const perfil = await actualizarPerfil(req.body, idUsuario);

        return res.status(200).send(perfil);
    }
    catch(error: any){
        res.status(400).send({message: 'Actualización fallida', error: error.message});
    }
}