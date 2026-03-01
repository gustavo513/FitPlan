import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ErrorLog, registrarError } from '../../utils/errorHandler';

const prisma = new PrismaClient();

export const validate = (schema: AnyZodObject[]) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
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
        catch (e: any) {
            if (e instanceof ZodError) {

                const error: any = {
                    message: 'ERROR DE VALIDACIÓN',
                    errors: e.errors.map(e => ({
                        field: e.path.join('.'),
                        code: e.message,
                    })),
                }

                registrarError({ statusCode: 400, message: error.message, errors: JSON.stringify(error.errors[0]) } as ErrorLog);

                return res.status(400).json(error);
            }
        }
    }