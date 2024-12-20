import {Request, Response} from "express";
import {registroUsuario, loginUsuario} from "./autenticacionService";

export async function registro(req: Request, res: Response){
    
    const {nombre_usuario, contrasenia} = req.body;

    try{
        const token = await registroUsuario(nombre_usuario, contrasenia);

        res.status(200).send({token});
    }
    catch(error: any){
        res.status(400).send({message: 'Registro fallido', error: error.message});
    }
};

export async function login(req: Request, res: Response){

    const {nombre_usuario, contrasenia} = req.body;

    try{
        const token = await loginUsuario(nombre_usuario, contrasenia);

        res.status(200).send({token});
    }
    catch(error: any){
        res.status(400).send({message: 'Inicio de sesión fallido'});
    }
}