import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function registro(nombre_usuario: string, contrasenia: string){
    
    const hashedPassword = await bcrypt.hash(contrasenia, 10);

    const usuario = await prisma.usuario.create({
        data: {
            nombre_usuario,
            contrasenia: hashedPassword,
            id_persona: 1
        }
    });

    return generarToken(usuario.id_usuario);
}

function generarToken(userId: Number){
    return jwt.sign({id: userId}, "_P#2f4L2I0@t6N", {expiresIn: '24h'})
}