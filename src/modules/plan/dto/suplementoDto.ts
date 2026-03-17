import { UnidadMedida } from "@prisma/client";

export class SuplementoDto {
    micronutriente: string[];
    medida: number;
    descripcion: string;
    unidad_medida: UnidadMedida;
    id_suplemento: number;

    constructor(
        micronutriente: string[],
        medida: number,
        descripcion: string,
        unidad_medida: UnidadMedida,
        id_suplemento: number,
    ){
        this.micronutriente = micronutriente,
        this.medida = medida,
        this.descripcion = descripcion,
        this.unidad_medida = unidad_medida,
        this.id_suplemento = id_suplemento
    }
}