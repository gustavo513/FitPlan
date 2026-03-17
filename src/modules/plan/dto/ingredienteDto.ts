import { UnidadMedidaDto } from "./unidadMedidaDto";

export class IngredienteDto {
        micronutrientes: string[];
        comida: string;
        descripcion: string;
        medida: number;
        proteinas: number;
        carbohidratos: number;
        id_ingrediente: number;
        grasa: number;
        unidad_medida: UnidadMedidaDto; // desestructurar los valores y eliminar UnidadMedidaDto para compactar más el json

        constructor(
            micronutrientes: string[],
            comida: string,
            descripcion: string,
            medida: number,
            proteinas: number,
            carbohidratos: number,
            id_ingrediente: number,
            grasa: number,
            unidad_medida: UnidadMedidaDto,            
        ){
            this.micronutrientes = micronutrientes,
            this.comida = comida,
            this.descripcion = descripcion,
            this.medida = medida,
            this.proteinas = proteinas,
            this.carbohidratos = carbohidratos,
            this.id_ingrediente = id_ingrediente,
            this.grasa = grasa,
            this.unidad_medida = unidad_medida
        }
}
