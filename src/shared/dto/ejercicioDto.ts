export class EjercicioDto {
    id_ejercicio: number;
    descripcion: string;
    duracion: number;
    peso?: number | undefined;

    constructor(
        id_ejercicio: number,
        descripcion: string,
        duracion: number,
        peso?: number | undefined
    ){
        this.id_ejercicio = id_ejercicio,
        this.descripcion = descripcion,
        this.duracion = duracion,
        this.peso = peso
    }
}