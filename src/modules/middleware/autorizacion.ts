import {Request, Response, NextFunction} from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const autorizacion = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const idUsuario = res.locals.user;

        const usuario = await prisma.usuario.findUnique({
            where: {
                id_usuario: idUsuario,
            },
            include: {
                rol: true
            }
        });

        res.locals.role = usuario?.rol.descripcion;

        if(!usuario || !roles.includes(usuario.rol.descripcion)){
            return res.status(403).json({message: 'No tiene permisos suficientes'});
        }

        next();
    }
};