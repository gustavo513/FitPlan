
export class ComposicionSuplementoDto {
    id_suplemento: number;
    descripcion: string;    
    medida: number;
    unidad_medida_descripcion: string;
    unidad_medida_abreviatura: string;
    micronutriente: string[];    

    constructor(
        id_suplemento: number,
        descripcion: string,        
        medida: number,
        unidad_medida_descripcion: string,
        unidad_medida_abreviatura: string,
        micronutriente: string[],
    ){
        this.id_suplemento = id_suplemento,
        this.descripcion = descripcion,
        this.medida = medida,
        this.unidad_medida_descripcion = unidad_medida_descripcion,
        this.unidad_medida_abreviatura = unidad_medida_abreviatura,
        this.micronutriente = micronutriente
    }
}