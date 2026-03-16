import z from 'zod';

const Ingrediente = z.string();

const Suplemento = z.string();

const Ejercicio = z.string()

const Micronutriente = z.string();

const UnidadMedida = z.object({
  descripcion: z.string(),
  abreviatura: z.string(),
});

const PlanIngrediente = z.object({
  comida: z.string(),
  ingrediente: Ingrediente,
  medida: z.number(),
  unidadMedida: UnidadMedida,
  grasas: z.number(),
  proteinas: z.number(),
  carbohidratos: z.number(),
  micronutrientes: z.array(Micronutriente)
});

const PlanSuplemento = z.object({
  suplemento: Suplemento,
  medida: z.number(),
  unidadMedida: UnidadMedida,
  grasas: z.number(),
  proteinas: z.number(),
  carbohidratos: z.number(),
  micronutrientes: z.array(Micronutriente)
});

const PlanEjercicio = z.object({
  ejercicio: Ejercicio,
  duracion: z.number(),
  peso: z.number(),
});

const Plan = z.object({
  comidas: z.array(PlanIngrediente),
  suplementos: z.array(PlanSuplemento),
  ejercicios: z.array(PlanEjercicio)
});

export default Plan;