export class ejercicioDto {
    id_ejercicio: number;
    descripcion: string;
    duracion: number;
    peso: number;

    constructor(
        id_ejercicio: number,
        descripcion: string,
        duracion: number,
        peso: number
    ){
        this.id_ejercicio = id_ejercicio,
        this.descripcion = descripcion,
        this.duracion = duracion,
        this.peso = peso
    }
}