import { z } from "zod";

export const UpdatePlanSchema = z.object({
    body: z.object({
        id_plan: z.number({required_error: 'Se requiere id_plan'}),
        peso_final: z.number({required_error: 'Se requiere peso_final'}),
        calificacion: z.number({required_error: 'Se requiere calificacion'}),
        comentario: z.string() || undefined
    })
});