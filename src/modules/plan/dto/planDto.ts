import { EjercicioDto } from "./ejercicioDto";
import { IngredienteDto } from "./ingredienteDto";
import { SuplementoDto } from "./suplementoDto";

export class PlanDto {
        id_plan: number;
        objetivo: string;
        preferencia_alimentaria: string;
        fecha: Date;
        cantidad_comida: number;
        peso_inicial: number;
        ingredientes: IngredienteDto[];
        suplementos: SuplementoDto[];
        ejercicios: EjercicioDto[];
        peso_final?: number | undefined;
        calificacion?: number | undefined;
        comentario?: string | undefined;
        
        constructor(
            id_plan: number,
            objetivo: string,
            preferencia_alimentaria: string,
            fecha: Date,
            cantidad_comida: number,
            peso_inicial: number,
            ingredientes: IngredienteDto[],
            suplementos: SuplementoDto[],
            ejercicios: EjercicioDto[],
            peso_final?: number | undefined,
            calificacion?: number | undefined,
            comentario?: string | undefined,
        ){
            this.id_plan = id_plan,
            this.objetivo = objetivo,
            this.preferencia_alimentaria = preferencia_alimentaria,
            this.fecha = fecha,
            this.cantidad_comida = cantidad_comida,
            this.peso_inicial = peso_inicial,
            this.peso_final = peso_final,
            this.calificacion = calificacion,
            this.comentario = comentario,
            this.ingredientes = ingredientes,
            this.suplementos = suplementos,
            this.ejercicios = ejercicios
        }
}