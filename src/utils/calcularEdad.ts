export const calcularEdad = (fechaNacimiento: Date) => {
    let age: number;

    const day = fechaNacimiento.getDate();
    const month = fechaNacimiento.getMonth();
    const year = fechaNacimiento.getFullYear();

    const dayCurrent = new Date().getDate();
    const monthCurrent = new Date().getMonth();
    const yearCurrent = new Date().getFullYear();

    if(month > monthCurrent){
         age = yearCurrent - year - 1;
    }
    else{
        if(month == monthCurrent && day < dayCurrent || month < monthCurrent){
            age = yearCurrent - year;
        }
        else{
            age = yearCurrent - year - 1;
        }
    }
    return age;
}