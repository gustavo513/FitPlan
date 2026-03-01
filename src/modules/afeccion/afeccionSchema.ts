import { z } from 'zod';

export const afeccionSchema = z.object({
    body: z.object({
        descripcion: z.string({ required_error: 'Se requiere afeccion' }).regex(new RegExp(/^[\p{L}0-9\s()]+$/ug), { message: 'Caracteres no validos en campo afeccion' })
    })
});

export type AfeccionSchemaBody = z.infer<typeof afeccionSchema.shape.body>;