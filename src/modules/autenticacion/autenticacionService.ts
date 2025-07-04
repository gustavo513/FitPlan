import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {PrismaClient } from "@prisma/client";
import { enviarEmail } from "./mailer";

const prisma = new PrismaClient();

export async function registroUsuario(email: string, nombre_usuario: string, contrasenia: string){
    
    const hashedPassword = await bcrypt.hash(contrasenia, 10);  //encripta o "hashea" una contraseña para almacenarla en la base de datos

    const usuario = await prisma.usuario.create({
        data: {
            email: email,
            nombre_usuario,
            contrasenia: hashedPassword
        }
    });
        
    return generarToken(usuario.id_usuario);
}

export async function loginUsuario(nombre_usuario: string, contrasenia: string){

    const usuario = await prisma.usuario.findFirst({
        where: {
            OR: [
                {
                    email: nombre_usuario
                },
                {
                    nombre_usuario: nombre_usuario
                }
            ]
        }
    });

    //verifica si la contraseña ingresada genera el mismo hash que la contraseña almacenada
    if (!usuario || !usuario.contrasenia || !await bcrypt.compare(contrasenia, usuario.contrasenia)){    
        throw new Error('Nombre de usuario o contraseña incorrectos');
    }

    //actualiza la fecha de la última sesión del usuario
    await prisma.usuario.update({
        where: {
            id_usuario: usuario.id_usuario
        },
        data: {
            fecha_ult_sesion: new Date()
        }
    });

    return generarToken(usuario.id_usuario);
}

export async function solicitudValidarCorreo(email: string) {
    
    const usuario = await prisma.usuario.findUnique({
        where: {
            email: email
        }
    });

    if (usuario) {
        throw new Error('El correo no está disponible para su uso');
    }
    return 0;
}

export async function solicitudValidarNombreUsuario(nombre_usuario: string) {
    
    const usuario = await prisma.usuario.findUnique({
        where: {
            nombre_usuario: nombre_usuario
        }
    });

    if (usuario) {
        throw new Error('El nombre de usuario no está disponible para su uso')
    }
    return 0;
}

export async function solicitudVerificarCorreo(idUsuario: number) {
    const usuario = await prisma.usuario.findUnique({
        where: {
            id_usuario: idUsuario
        }
    });

    const token = generarToken(usuario?.id_usuario!);

    const fechaActual = new Date();
    const fechaExpiracion = new Date(fechaActual);
    fechaExpiracion.setHours(fechaActual.getHours() + 1);  
    
    await prisma.usuario.update({
        where: {
            id_usuario: idUsuario
        },
        data: {
            token: token,
            token_expiracion: fechaExpiracion
        }
    });

    const URL = `http://localhost:3000/autenticacion/confirmar-correo/${token}`;

    await enviarEmail(usuario?.email!, 'Confirmar correo electrónico', `Por favor, le pedimos que nos confirme su identidad accediendo al siguiente enlace: ${URL}`);
}

export async function solicitudConfirmarCorreo(token: string) {

    const usuario = await prisma.usuario.findFirst({
        where: {
            token: token
        }
    });

    if (usuario) {
        const fechaActual = new Date();
        if (usuario.token_expiracion && usuario.token_expiracion > fechaActual) {
            await prisma.usuario.update({
                where: {
                    id_usuario: usuario.id_usuario
                },
                data: {
                    confirm_email: 1,
                    token: null,
                    token_expiracion: null,
                    estado: 1
                }
            });
        }
        else {
            throw new Error('Token expirado');
        }
    }
    else {
        throw new Error('Error al intentar confirmar el correo electrónico. Intente más tarde.');
    }
}

export async function solicitudContrasenaOlvidada(email: string) {
    
    const usuario = await prisma.usuario.findUnique({
        where: {
            email: email
        }
    });

    if (!usuario) {
        throw new Error('El correo propocionado no se encuentra registrado');
    }
    else {
        const token = generarToken(usuario.id_usuario);

        const fechaActual = new Date();
        const fechaExpiracion = new Date(fechaActual);
        fechaExpiracion.setHours(fechaActual.getHours() + 1);

        const tokenUsuario = await prisma.usuario.update({
            where: {
                email: email
            },
            data: {
                token: token,
                token_expiracion: fechaExpiracion
            }
        });

        const URL = `http://localhost:3000/autenticacion/restablecer-contrasena/${token}`;

        await enviarEmail(email, 'Restablecimiento de contraseña', `Has solicitado el restablecimiento de tu contraseña. Por favor, ingresa al enlace para restablecer tu contraseña: ${URL}`);
    }

}

export async function solicitudRestablecerContrasena(token: string, contrasena: string) {
    const usuario = await prisma.usuario.findFirst({
        where: {
            token: token
        }
    });

    if (!usuario) {
        return 'Token no válido.';
    }

    const tiempoActual = new Date();

    if (!usuario.token_expiracion || usuario.token_expiracion < tiempoActual) {
        throw new Error('Token expirado. Intente otra vez.');
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await prisma.usuario.update({
        where: {
            id_usuario: usuario.id_usuario
        },
        data: {
            token: null,
            token_expiracion: null,
            contrasenia: hashedPassword
        }
    });

    return 'Contraseña restablecida con éxito.';
}


function generarToken(userId: Number){
    return jwt.sign({id: userId}, process.env.JWT_SECRET_KEY as string, {expiresIn: '24h'}) //función que genera un token
}