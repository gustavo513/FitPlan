import {Request, Response} from "express";
import {
    registroUsuario,
    loginUsuario,
    solicitudValidarCorreo,
    solicitudValidarNombreUsuario,
    solicitudVerificarCorreo,
    solicitudConfirmarCorreo,
    solicitudContrasenaOlvidada,
    solicitudRestablecerContrasena
} from "./autenticacionService";

import {
    RegistroSchemaBody, 
    LoginSchemaBody, 
    CorreoRequeridoSchemaBody,
    ContrasenaRequeridaSchemaBody,
    TokenRequeridoSchemaParams
} from "./autenticacionSchema";

export async function registro(req: Request<{}, {}, RegistroSchemaBody>, res: Response){
    
    const {email, nombre_usuario, contrasena} = req.body;

    try{
        const token = await registroUsuario(email, nombre_usuario, contrasena);

        res.status(200).send({token});
    }
    catch(error: any){
        res.status(400).send({message: 'Registro fallido', error: error.message});
    }
};

export async function login(req: Request<{}, {}, LoginSchemaBody>, res: Response){

    const {nombre_usuario, contrasena} = req.body;

    try{
        const token = await loginUsuario(nombre_usuario, contrasena);

        res.status(200).send({token});
    }
    catch(error: any){
        res.status(400).send({ message: 'Inicio de sesión fallido', error: error.message});
    }
}

export async function validarCorreo(req: Request<{}, {}, CorreoRequeridoSchemaBody>, res: Response) {
    try {

        const email = req.body.email;

        const validacion = await solicitudValidarCorreo(email);

        if (validacion == 0) {
            return res.status(200).send({ message: 'El correo está disponible para usarse' });
        }
    }
    catch (error: any) {
        return res.status(404).send({ message: 'Error al validar correo', error: error.message });
    }
}

export async function validarNombreUsuario(req: Request, res: Response) {
    try{

        const nombre_usuario = req.body.nombre_usuario;

        const validacion = await solicitudValidarNombreUsuario(nombre_usuario);

        if (validacion == 0) {
            return res.status(200).send({ message: 'El nombre de usuario está disponible para usarse' });
        }
    }
    catch (error: any) {
        return res.status(404).send({ message: 'Error al validar nombre de usuario', error: error.message });
    }
}

export async function verificarCorreo(req: Request<{}, {}, CorreoRequeridoSchemaBody>, res: Response) {
    try {
        const idUsuario = res.locals.user;

        await solicitudVerificarCorreo(idUsuario);

        return res.status(200).send('Verificación en proceso...');
    }
    catch (error: any) {
        return res.status(404).send({ message: 'Error en la verificación del correo', error: error.message });
    }
}

export async function confirmarCorreo(req: Request, res: Response) {
    try {
        const token = req.params.token;

        await solicitudConfirmarCorreo(token);

        return res.status(200).send('El correo fue verificado con éxito');
    }
    catch (error: any) {
        return res.status(404).send({ message: 'No se pudo confirmar el correo propocionado', error: error.message});
    }
}

export async function contrasenaOlvidada(req: Request<{}, {}, CorreoRequeridoSchemaBody>, res: Response) {
    try {
        const email = req.body.email;

        await solicitudContrasenaOlvidada(email);

        return res.status(200).send('Se ha enviado el enlace de restablecimiento de contraseña');
    }
    catch (error: any) {
        return res.status(404).send({ message: 'Se ha producido un error', error: error.message });
    }
}

export async function restablecerContrasena(req: Request<TokenRequeridoSchemaParams, {}, ContrasenaRequeridaSchemaBody>, res: Response) {
    try {
        const contrasenia = req.body.contrasena;

        const token: string = req.params.token;

        const r = await solicitudRestablecerContrasena(token, contrasenia);

        return res.status(200).send(r);
    }
    catch (error: any) {
        return res.status(400).send({ message: 'Error al restablecer contraseña', error: error.message });
    }
}