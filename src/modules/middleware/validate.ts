import {Request, Response, NextFunction} from 'express';
import {AnyZodObject} from 'zod';

export const validate = (schema: AnyZodObject[]) =>
(req: Request, res: Response, next: NextFunction) => {
    try{
       /* schema.parse({
            params: req.params,
            body: req.body,
            query: req.query,
        });*/

        schema.map((value) => {
            value.parse({
                params: req.params,
                body: req.body,
                query: req.query
            });
        });
        
        return next();
    }
    catch(e: any){
        res.status(400).send(e.errors);
    }
};
