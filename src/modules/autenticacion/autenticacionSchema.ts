import {z} from "zod";

export const registroSchema = z.object({
    body: z.object({
        email: z.string({required_error: 'El correo electrónico es requerido'}).email(),
        nombre_usuario: z.string({required_error: 'El nombre de usuario es requerido'}).min(6, {message: 'Debe contener por lo menos 6 caracteres [letras, números, . o _]'}).regex(new RegExp('.*[az]*[_ | . | az | 09]*.*'), {message: 'Valor no valido'}),
        contrasenia: z.string({required_error: 'Contraseña es requerida'})
    }),
});

export const loginSchema = z.object({
    body: z.object({
        nombre_usuario: z.string({required_error: 'Nombre de usuario es requerido'}),
        contrasenia: z.string({required_error: 'Contraseña es requerida'})
    }),
});

export type RegistroSchemaBody = z.infer<typeof registroSchema.shape.body>;
export type LoginSchemaBody = z.infer<typeof loginSchema.shape.body>;