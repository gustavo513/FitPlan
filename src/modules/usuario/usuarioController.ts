import {Request, Response} from 'express';

import {
    obtenerMiUsuario,
    obtenerUsuario,
    actualizarUsuario,
    cambiarContrasenia,
    eliminarUsuario,
    listarUsuariosSupervisados
} from '../usuario/usuarioService';

export async function miUsuario(req: Request, res: Response) {
    try {
        const idUsuario = res.locals.user;

        const usuario = await obtenerMiUsuario(idUsuario);

        return res.status(200).send(usuario);
    }
    catch (error: any) {
        return res.status(404).send({ message: 'Registro no encontrado', error: error.message});
    }
}

export async function obtener(req: Request, res: Response){
    try{
        const idUsuario = parseInt(req.params.id);

        const usuario = await obtenerUsuario(idUsuario);

        res.status(200).send(usuario);
    }
    catch(error: any){
        return res.status(404).send({message: 'Registro de usuario no encontrado', error: error.message});
    }
};

export async function actualizar(req: Request, res: Response){
    try{
        const idUsuario = res.locals.user;

        const usuario = await actualizarUsuario(req.body, idUsuario);

        return res.status(200).send(usuario);
    }
    catch(error: any){
        return res.status(400).send({message: 'Actualización fallida', error: error.message});
    }
};

export async function actualizarContrasenia(req: Request, res: Response){
    try{
        const idUsuario = res.locals.user;

        await cambiarContrasenia(req.body.contrasenia, idUsuario);

        res.status(200).send({message: 'Cambio de contraseña exitoso'});
    }
    catch(error: any){
        return res.status(400).send({message: 'Error al intentar cambiar contraseña', error: error.message});
    }
};

export async function eliminar(req: Request, res: Response){
    try{
        const idUsuario = res.locals.user;

        await eliminarUsuario(idUsuario);

        return res.status(200).send({message: 'Registro de usuario eliminado correctamente'});
    }
    catch(error: any){
        return res.status(404).send({message: 'Error al intentar eliminar registro', error: error.message});
    }
};

export async function listarUsSup(req: Request, res: Response){
    try{
        const idSupervisor = res.locals.user;

        const usuarios = await listarUsuariosSupervisados(idSupervisor);

        return res.status(200).send(usuarios);
    }
    catch(error: any){
        return res.status(404).send({message: 'Registros no encontrados', error: error.message});
    }
};