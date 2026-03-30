import { Request, Response } from 'express';
import { updateIngredienteSchema } from './dto/updateIngredienteSchema';
import { sustituirIngredienteService } from './ingredienteService';

export const sustituirIngredienteController = async (req: Request, res: Response) => {
    try{
        const {id_plan, comida, id_ingredientes, id_complementarios, id_ingredientes_otros} = req.body;

        const resultado = await sustituirIngredienteService({id_plan, comida, id_ingredientes, id_complementarios, id_ingredientes_otros} as updateIngredienteSchema);

        return res.json(resultado);
    }
    catch(error: any){
        console.log(error);
        if(error.statusCode != null){
            return res.status(error.statusCode).json({message: error.errors[0].message});
        }
        return res.status(500).json({message: 'Error desconocido'});
    }
}