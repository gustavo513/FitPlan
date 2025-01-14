import {Request, Response} from 'express';

import {
    obtenerMiUsuario,
    obtenerUsuarioPorId,
    obtenerUsuarioPorNombreUsuario,
    actualizarUsuario,
    cambiarContrasenia,
    eliminarUsuario,
    listarUsuariosSupervisores,
    listarUsuariosSupervisados,
    eliminarUsuarioSupervisor
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

export async function obtenerPorId(req: Request, res: Response){
    try{
        const idUsuario = parseInt(req.params.id);

        const usuario = await obtenerUsuarioPorId(idUsuario);

        res.status(200).send(usuario);
    }
    catch(error: any){
        return res.status(404).send({message: 'Registro de usuario no encontrado', error: error.message});
    }
};

export async function obtenerPorNombreUsuario(req: Request, res: Response){
    try {
        const nombre_usuario = req.params.nombre_usuario;

        const usuario = await obtenerUsuarioPorNombreUsuario(nombre_usuario);

        return res.status(200).send(usuario);
    }
    catch (error: any) {
        return res.status(404).send({ message: 'No encontrado', error: error.message });
    }
}

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

        const contraseniaActual = req.body.contrasenia;

        const contraseniaNueva = req.body.contrasenia_nueva;

        await cambiarContrasenia(contraseniaActual, contraseniaNueva, idUsuario);

        res.status(200).send({message: 'Cambio de contraseña exitoso'});
    }
    catch(error: any){
        return res.status(400).send({message: 'Error al intentar cambiar contraseña', error: error.message});
    }
};

export async function eliminar(req: Request, res: Response){
    try{
        const idUsuario = res.locals.user;

        await eliminarUsuario(idUsuario, res.locals.role);

        return res.status(200).send({message: 'Registro de usuario eliminado correctamente'});
    }
    catch(error: any){
        return res.status(404).send({message: 'Error al intentar eliminar registro', error: error.message});
    }
};

export async function listarSupervisores(req: Request, res: Response){
    try {
        const idUsuario = res.locals.user;

        const supervisores = await listarUsuariosSupervisores(idUsuario);

        return res.status(200).send(supervisores);
    }
    catch (error: any) {
        return res.status(404).send({ message: 'Registros no encontrados', error: error.message });
    }
}

export async function listarSupervisados(req: Request, res: Response){
    try{
        const idSupervisor = res.locals.user;

        const usuarios = await listarUsuariosSupervisados(idSupervisor);

        return res.status(200).send(usuarios);
    }
    catch(error: any){
        return res.status(404).send({message: 'Registros no encontrados', error: error.message});
    }
};

export async function eliminarSupervision(req: Request, res: Response) {
    try {
        const idUsuarioActual = res.locals.user;
        const id = parseInt(req.params.id);

        await eliminarUsuarioSupervisor(idUsuarioActual, id, res.locals.role);

        return res.status(200).send({ message: 'Supervisión eliminada' });
    }
    catch (error: any) {
        return res.status(404).send({ message: 'No se pudo procesar la solicitud', error: error.message });
    }
}