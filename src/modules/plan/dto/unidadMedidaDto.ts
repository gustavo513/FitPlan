export class UnidadMedidaDto {
    descripcion: string;
    abreviatura: string;
    id_unidad_medida: number;
    
    constructor(
        descripcion: string,
        abreviatura: string,
        id_unidad_medida: number,
    ){
        this.descripcion = descripcion,
        this.abreviatura = abreviatura,
        this.id_unidad_medida = id_unidad_medida
    }
};