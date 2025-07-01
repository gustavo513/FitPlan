import {z} from 'zod';

export const afeccionSchema = z.object({
    body: z.object({
        descripcion: z.string({required_error: 'Se requiere afeccion'}).regex(new RegExp(/^[\s?a-zA-Z\s?]+$/g), {message: 'Caracteres no validos en campo afeccion'})
    })
});

export type AfeccionSchemaBody = z.infer<typeof afeccionSchema.shape.body>;