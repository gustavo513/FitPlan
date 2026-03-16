export const calcularMetabolismoBasal = (sexo: string, peso: number, altura: number, edad: number): number => {

    let metabolismoBasal: number = 0;

    if(sexo == 'M'){
        metabolismoBasal = 10 * peso + 6.25 * altura * 100 - 5 * edad + 5;
    }
    else{
        metabolismoBasal = 10 * peso + 6.25 * altura * 100 - 5 * edad - 161;
    }

    return metabolismoBasal;
}