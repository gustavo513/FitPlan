import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function registroUsuario(nombre_usuario: string, contrasenia: string){
    
    const hashedPassword = await bcrypt.hash(contrasenia, 10);  //encripta o "hashea" una contraseña para almacenarla en la base de datos

    const usuario = await prisma.usuario.create({
        data: {
            nombre_usuario,
            contrasenia: hashedPassword
        }
    });

    return generarToken(usuario.id_usuario);
}

export async function loginUsuario(nombre_usuario: string, contrasenia: string){

    const usuario = await prisma.usuario.findUnique({
        where: {
            nombre_usuario
        }
    });

    if(!usuario || !await bcrypt.compare(contrasenia, usuario.contrasenia)){    //verifica si la contraseña ingresada genera el mismo hash que la contraseña almacenada
        throw new Error('Nombre de usuario o contraseña incorrectos');
    }

    return generarToken(usuario.id_usuario);
}

function generarToken(userId: Number){
    return jwt.sign({id: userId}, process.env.JWT_SECRET_KEY as string, {expiresIn: '24h'}) //función que genera un token
}