import {Request, Response, NextFunction} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

export const autenticacion = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({message: 'Token no proveído'});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string); //decodifica el token utilizando la clave

        if(typeof decoded !== "string" && "id" in decoded){
            res.locals.user = (decoded as JwtPayload).id;
            next();
        }
        else{
            res.status(401).json({message: "Token no válido"});
        }
    }
    catch(error: any){
        res.status(401).json({message: 'Token no válido'});
    }
};