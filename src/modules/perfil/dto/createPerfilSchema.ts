import { z } from 'zod';

export const createPerfilSchema = z.object({
    body: z.object({
        nombre: z.string({ required_error: 'Se requiere el nombre' }).regex(new RegExp(/^[\s?a-zA-Z\s?]+$/g), { message: 'Valores no validos en campo nombre' }),
        apellido: z.string({ required_error: 'Se requiere el apellido' }).regex(new RegExp(/^[\s?a-zA-Z\s?]+$/g), { message: 'Valores no validos en campo apellido' }),
        genero: z.string({ required_error: 'Se requiere el género' }),
        fechaNacimiento: z.string({ required_error: 'Se requiere la fecha de nacimiento' }).datetime(),
        altura: z.number({ required_error: 'Se requiere la altura' }),
        peso: z.number({ required_error: 'Se requiere el peso' }),
        afecciones: z.array(
            z.object({
                id: z.number().positive(),
            })
        ),
        preferencias_alimentarias: z.array(
            z.object({
                id: z.number().positive(),
            })
        )
    }),
});

export type CreatePerfilSchema = z.infer<typeof createPerfilSchema.shape.body>;