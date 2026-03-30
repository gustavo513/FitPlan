import { Request, Response } from 'express';
import {
    obtenerMiPerfil,
    obtenerPerfil,
    agregarPerfil,
    actualizarPerfil
} from './perfilService';

import { CreatePerfilSchema } from './dto/createPerfilSchema';
import { UpdatePerfilSchema } from './dto/updatePerfilSchema';
import { ErrorLog, registrarError } from '../../utils/errorHandler';

export async function miPerfil(req: Request, res: Response) {
    try {
        const idUsuario = res.locals.user;

        const usuario = await obtenerMiPerfil(idUsuario);

        const afecciones = usuario?.afeccion.map((item) => item.afeccion);

        const preferencias = usuario?.pref_alim.map((item) => item.prefalim);

        const resultado = {
            id_perfil: usuario?.id_perfil,
            nombre: usuario?.nombre,
            apellido: usuario?.apellido,
            genero: usuario?.genero,
            fecha_nacimiento: usuario?.fechaNacimiento,
            altura: usuario?.altura,
            peso: usuario?.peso,
            id_usuario: usuario?.id_usuario,
            url_foto_perfil: usuario?.url_foto_perfil,
            afecciones: afecciones,
            preferencias_alimentarias: preferencias
        };

        return res.status(200).send(resultado);
    }
    catch (error: any) {
        return res.status(404).send({ message: 'Registro no encontrado', error: error.message });
    }
}

export async function obtener(req: Request, res: Response) {
    try {
        const idPerfil = parseInt(req.params.id);

        const idUsuario = res.locals.user;

        const perfil = await obtenerPerfil(idPerfil, idUsuario, res.locals.role);

        res.status(200).send(perfil);
    }
    catch (error: any) {
        res.status(404).send({ message: 'Registro no encontrado', error: error.message })
    }
}

export async function agregar(req: Request<{}, {}, CreatePerfilSchema>, res: Response) {

    const id_usuario = res.locals.user;

    let { nombre, apellido, genero, fechaNacimiento, altura, peso, afecciones, preferencias_alimentarias } = req.body;

    nombre = nombre.trim();

    apellido = apellido.trim();

    try {
        const perfil = await agregarPerfil({ nombre, apellido, genero, fechaNacimiento, altura, peso, afecciones, preferencias_alimentarias }, id_usuario);

        return res.status(201).send(perfil);
    }
    catch (error: any) {
        res.status(400).send({ message: 'Registro fallido', error: error.message });
    }
};

export async function actualizar(req: Request<{}, {}, UpdatePerfilSchema>, res: Response) {

    try {

        const id_usuario = res.locals.user;

        let { nombre, apellido, genero, fechaNacimiento, altura, peso, afecciones, preferencias_alimentarias } = req.body;

        console.log(req.body);

        nombre = nombre.trim();

        apellido = apellido.trim();

        const perfil = await actualizarPerfil({ nombre, apellido, genero, fechaNacimiento, altura, peso, afecciones, preferencias_alimentarias }, id_usuario);

        return res.status(200).send(perfil);
    }
    catch (error: any) {
        const errors: ErrorLog = {
            statusCode: 400,
            message: 'Actualización fallida',
            errors: JSON.stringify(error)
        }
        await registrarError(errors);
        res.status(400).send(errors);
    }
}