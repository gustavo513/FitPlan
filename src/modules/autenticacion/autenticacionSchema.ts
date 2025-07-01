import {z} from "zod";

export const registroSchema = z.object({
    body: z.object({
        email: z.string({required_error: 'El correo electrónico es requerido'}).email({message: 'El formato del email debe ser valido. Ejemplo: usuario@ejemplo.com'}),
        nombre_usuario: z.string({required_error: 'El nombre de usuario es requerido'})
                        .min(6, {message: 'Debe contener por lo menos 6 caracteres [letras, números, . o _]'})
                        .max(20, {message: 'Debe contener hasta 20 caracteres [letras, números, . o _]'})
                        .regex(new RegExp(/^[a-z]+[_ || . || a-z || 0-9]+$/g), {message: 'Valor no valido'}),
        contrasena: z.string({required_error: 'Contraseña es requerida'})
    }),
});

export const loginSchema = z.object({
    body: z.object({
        nombre_usuario: z.string({required_error: 'Nombre de usuario es requerido'}),
        contrasena: z.string({required_error: 'Contraseña es requerida'})
    }),
});

export const correoRequeridoSchema = z.object({
    body: z.object({
        email: z.string({required_error: 'El correo electrónico es requerido'}).email({message: 'El formato del email debe ser valido. Ejemplo: usuario@ejemplo.com'}),
    }),
});

export const contrasenaRequeridaSchema = z.object({
    body: z.object({
        contrasena: z.string({required_error: 'La contraseña es requerida'})
    }),
});

export const tokenRequeridoSchema = z.object({
    params: z.object({
        token: z.string({required_error: 'Token no valido'})
                .min(100, {message: 'El token es requerido'})
    }),
});

export type RegistroSchemaBody = z.infer<typeof registroSchema.shape.body>;
export type LoginSchemaBody = z.infer<typeof loginSchema.shape.body>;
export type CorreoRequeridoSchemaBody = z.infer<typeof correoRequeridoSchema.shape.body>;
export type ContrasenaRequeridaSchemaBody = z.infer<typeof contrasenaRequeridaSchema.shape.body>;
export type TokenRequeridoSchemaParams = z.infer<typeof tokenRequeridoSchema.shape.params>;