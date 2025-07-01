import { z } from 'zod';

export const perfilSchema = z.object({
    body: z.object({
        nombre: z.string({required_error: 'Se requiere el nombre' }).regex(new RegExp(/^[\s?a-zA-Z\s?]+$/g), {message: 'Valores no validos en campo nombre'}),
        apellido: z.string({required_error: 'Se requiere el apellido'}).regex(new RegExp(/^[\s?a-zA-Z\s?]+$/g), {message: 'Valores no validos en campo apellido'}),
        genero: z.string({required_error: 'Se requiere el género'}),
        fechaNacimiento: z.string({required_error: 'Se requiere la fecha de nacimiento'}).datetime(),
        altura: z.number({required_error: 'Se requiere la altura'}),
        peso: z.number({required_error: 'Se requiere el peso'}),
        id_ciudad: z.number({required_error: 'Se requiere el identificador de la ciudad'})
    }),
});

export type PerfilSchemaBody = z.infer<typeof perfilSchema.shape.body>;