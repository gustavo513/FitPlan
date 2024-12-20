import {z} from "zod";

export const registroSchema = z.object({
    body: z.object({
        nombre_usuario: z.string({required_error: 'Nombre de usuario es requerido'}),
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