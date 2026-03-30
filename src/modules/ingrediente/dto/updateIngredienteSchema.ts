import { z } from 'zod';

export const updateIngredienteSchema = z.object({
    body: z.object({
        id_plan: z.number({required_error: 'Se requiere id_plan'}),
        comida: z.string({required_error: 'Se requiere comida'}),
        id_ingredientes: z.array(z.number(), {required_error: 'Se requiere id_ingredientes'}),
        id_complementarios: z.array(z.number(), {required_error: 'Se requiere id_complementarios'}),
        id_ingredientes_otros: z.array(z.number())
    }),
});

export type updateIngredienteSchema = z.infer<typeof updateIngredienteSchema.shape.body>;