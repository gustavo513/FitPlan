import {Request, Response} from "express";
import {registroUsuario, loginUsuario} from "./autenticacionService";

import {RegistroSchemaBody, LoginSchemaBody} from "./autenticacionSchema";

export async function registro(req: Request<{}, {}, RegistroSchemaBody>, res: Response){
    
    const {nombre_usuario, contrasenia} = req.body;

    try{
        const token = await registroUsuario(nombre_usuario, contrasenia);

        res.status(200).send({token});
    }
    catch(error: any){
        res.status(400).send({message: 'Registro fallido', error: error.message});
    }
};

export async function login(req: Request<{}, {}, LoginSchemaBody>, res: Response){

    const {nombre_usuario, contrasenia} = req.body;

    try{
        const token = await loginUsuario(nombre_usuario, contrasenia);

        res.status(200).send({token});
    }
    catch(error: any){
        res.status(400).send({ message: 'Inicio de sesión fallido', error: error.message});
    }
}