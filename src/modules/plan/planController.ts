import { Request, Response } from "express";
import { generarPlanService } from "./planService";

export const generarPlanController = async (req: Request, res: Response) => {
    try{
        const id_usuario = res.locals.user;

        const resultado = await generarPlanService(req.body, id_usuario);

        return res.json(resultado);
    }
    catch(error: any){
        if(error.statusCode != null){
            return res.status(error.statusCode).json({'message': error.message});
        }
        console.error(error.message);
        return res.status(500).json(error);
    }
}