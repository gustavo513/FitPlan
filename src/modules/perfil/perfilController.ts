import {Request, Response} from 'express';
import { 
    obtenerMiPerfil,
    obtenerPerfil,
    agregarPerfil,
    actualizarPerfil
} from './perfilService';

import { PerfilSchemaBody } from './perfilSchema';

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

export async function agregar(req: Request<{}, {}, PerfilSchemaBody>, res: Response){

    const id_usuario = res.locals.user;

    let {nombre, apellido, genero, fechaNacimiento, altura, peso, id_ciudad} = req.body;

    nombre = nombre.trim();

    apellido = apellido.trim();

    try{
        const perfil = await agregarPerfil({nombre, apellido, genero, fechaNacimiento, altura, peso, id_ciudad}, id_usuario);

        return res.status(201).send(perfil);
    }
    catch(error: any){
        res.status(400).send({message: 'Registro fallido', error: error.message});
    }
};

export async function actualizar(req: Request<{}, {}, PerfilSchemaBody>, res: Response){

    try{
        
        const id_usuario = res.locals.user;

        let {nombre, apellido, genero, fechaNacimiento, altura, peso, id_ciudad} = req.body;

        nombre = nombre.trim();

        apellido = apellido.trim();

        const perfil = await actualizarPerfil({nombre, apellido, genero, fechaNacimiento, altura, peso, id_ciudad}, id_usuario);

        return res.status(200).send(perfil);
    }
    catch(error: any){
        res.status(400).send({message: 'Actualización fallida', error: error.message});
    }
}