import { z } from 'zod';

export const createPlanSchema = z.object({
    body: z.object({
        id_objetivo: z.number({required_error: 'Se requiere id_objetivo'}),
        cantidad_comidas: z.number({required_error: 'Se requiere cantidad_comidas'}),
        id_tipo_ejercicio: z.number({required_error: 'Se requiere id_tipo_ejercicio'}),
    })
});

export type CreatePlanSchema = z.infer<typeof createPlanSchema.shape.body>;