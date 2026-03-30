import { Request, Response } from "express";
import { NotFoundError } from "../../utils/errors/notFoundError";
import { actualizarPlanService, generarPlanService, obtenerPlanActualService } from "./planService";

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

export const obtenerPlanActualController = async (req: Request, res: Response) => {
    try{
        const id_usuario = res.locals.user;

        const plan = await obtenerPlanActualService(id_usuario);

        return res.json(plan);
    }
    catch(error: any){
        if(error.statusCode != null){
            return res.status(error.statusCode).json({message: error.message});
        }
        return res.status(500).json(error);
    }
}

export const actualizarPlanController = async (req: Request, res: Response) => {
    try{
        const {id_plan, peso_final, calificacion, comentario} = req.body;

        const resultado = await actualizarPlanService(id_plan, peso_final, calificacion, comentario);

        return res.json(resultado);
    }
    catch(error: any){
        if(error.code == 'P2025'){
            const e = new NotFoundError('No se encontraron registros del plan en estado vencido');
            return res.status(404).json({message: e.errors[0].message});
        }
        return res.status(500).send(error);
    }
}