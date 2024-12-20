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
        const decoded = jwt.verify(token, "_P#2f4L2I0@t6N");

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