
export class IngredienteDto {
        comida: string;
        id_ingrediente: number;
        descripcion: string;
        medida: number;
        unidad_medida_descripcion: string;
        unidad_medida_abreviatura: string;
        proteinas: number;
        carbohidratos: number;
        grasa: number;
        micronutrientes: string[];

        constructor(
            comida: string,
            id_ingrediente: number,
            descripcion: string,
            medida: number,
            unidad_medida_descripcion: string,
            unidad_medida_abreviatura: string,
            proteinas: number,
            carbohidratos: number,
            grasa: number,
            micronutrientes: string[],         
        ){
            this.comida = comida,
            this.id_ingrediente = id_ingrediente,
            this.descripcion = descripcion,
            this.medida = medida,
            this.unidad_medida_descripcion = unidad_medida_descripcion, 
            this.unidad_medida_abreviatura = unidad_medida_abreviatura,
            this.proteinas = proteinas,
            this.carbohidratos = carbohidratos,
            this.grasa = grasa,
            this.micronutrientes = micronutrientes
        }
}
