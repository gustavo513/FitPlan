import { Ingrediente, PrismaClient } from "@prisma/client";
import { z } from "zod";
import chatgptReq from "../../config/openai-configure";
import { Sustituto } from "../../types/openai.types";
import { BadGatewayError } from "../../utils/errors/badGatewayError";
import { updateIngredienteSchema } from "./dto/updateIngredienteSchema";

const prisma = new PrismaClient();

// Estructura de datos interna solo para service
const listaSustituto = z.object({
    sustituto: z.array(Sustituto)
});

// Lógica interna para formatear listado de ingredientes solo para service
const listarIngredientes = (value: any, index: number, array: string[]): string => {
    if(array.length == 1){
        return value;
    }
    else if(index == array.length - 1){
        return ' ' + value;
    }
    return ' ' + value;
}

export const sustituirIngredienteService = async (data: updateIngredienteSchema) => {

    // Verificar primero si los ingrediente a reemplazar ya tienen algún sustituto en el plan (en la base datos)
    // Si todos los sustitutos registrados fueron rechazados por el usuario, entonces incluirlos en el prompt para generar más alternativas
    // Falta implementar

    const ingredientes: Ingrediente[] = [];
    const ingredienteFormateado: string[] = [];
    // Obtener la descripción de los ingredientes y sus medidas
    for(const item of data.id_ingredientes){
        const ingrediente = await prisma.ingrediente.findUnique({
            where: {
                id_ingrediente: item
            },
            select: {
                id_ingrediente: true,
                descripcion: true,
            },
        });

        ingredientes.push(ingrediente as Ingrediente);

        const composicionIngredientePlan = await prisma.plan_Ingrediente.findUnique({
            where: {
                id_ingrediente_id_plan: {
                    id_plan: data.id_plan,
                    id_ingrediente: item
                }
            },
            include: {
                unidad_medida: {
                    select: {
                        abreviatura: true
                    }
                }
            }
        });

        const descripcion = `${composicionIngredientePlan?.medida} ${composicionIngredientePlan?.unidad_medida.abreviatura} de ${ingrediente?.descripcion}`;

        ingredienteFormateado.push(descripcion);
    }

    const complementarioFormateado: string[] = [];
    // Obtener la descripción de los ingredientes complementarios
    for(const item of data.id_complementarios){
        const complemento = await prisma.ingrediente.findUnique({
            where: {
                id_ingrediente: item
            },
            select: {
                id_ingrediente: true,
                descripcion: true,
            },            
        });
        
        complementarioFormateado.push(complemento?.descripcion!);
    }

    const ingredientesOtros: string[] = [];
    // Obtener la descripción de otras comidas del día
    for(const item of data.id_ingredientes_otros){
        const ingrediente = await prisma.ingrediente.findUnique({
            where: {
                id_ingrediente: item
            }
        });

        ingredientesOtros.push(ingrediente?.descripcion!);
    } 

    // Preparar mensaje para el prompt
    const mensaje = `Buscar un sustituto para ${
        ingredienteFormateado.map(listarIngredientes)
    }, y que combine en una comida de ${data.comida} de Paraguay con los siguientes ingredientes:${
        complementarioFormateado.map(listarIngredientes)
    }. Listar solo sustituidos, limitarse a un sustituto por comida. En las comidas del día ya se incluyen:${ingredientesOtros.map(listarIngredientes)}`;

    /* const mensaje = `
    Quiero alternativas para ${
        ingredienteFormateado.map(listarIngredientes)
    }, y que combine en una comida de desayuno con: ${
        complementarioFormateado.map(listarIngredientes)
    }. Evitar redundancia nutricional o mismo grupo alimenticio. Durante el día ya consume Pechuga de pollo a la plancha, Arroz integral, Ensalada de espinaca,
    Pescado (merluza) al horno, Quinoa cocida, Brócoli al vapor.  Entre los objetivos puede ser cualquiera entre: practicidad (sin cocción). Listar solo sustituidos. Ser específico, técnico y aplicable. Evitar generalidades. No usar lenguaje ambiguo
    `;*/

    console.log(mensaje);

    // Realizar el prompt
    const resultado = await chatgptReq(mensaje, listaSustituto);

    if(resultado == null){
        throw new BadGatewayError('No se pudo generar un sustituto');
    }
    
    // Realizar el upsert del ingrediente sustituto si es nuevo o si ya existe
    await prisma.$transaction(async (tx) => {
        for(const sustituto of resultado.sustituto){
            let idIngredienteOriginal: number | undefined;
            let descripcionSustituto: string | undefined;
            let medidaSustituto: number | undefined;

            ingredientes.forEach((item) => {
                if(sustituto.nombre_original == item.descripcion){
                    idIngredienteOriginal = item.id_ingrediente;
                    descripcionSustituto = sustituto.nombre_sustituto;
                    medidaSustituto = sustituto.medida;
                }
            });

            if(idIngredienteOriginal != null && descripcionSustituto != null && medidaSustituto){

                // Se actualiza o inserta el sustituto como ingrediente
                const nuevoIngrediente = await tx.ingrediente.upsert({
                        where: {
                            descripcion: descripcionSustituto!
                        },
                        create: {
                            descripcion: descripcionSustituto!
                        },
                        update: {
                            descripcion: descripcionSustituto!
                        }
                });

                // Se asocia un ingrediente con el sustituto
                await tx.ingrediente_sustituto.upsert({
                    where: {
                        id_ingrediente_id_sustituto: {
                            id_ingrediente: idIngredienteOriginal,
                            id_sustituto: nuevoIngrediente.id_ingrediente
                        }
                    },
                    create: {
                        id_ingrediente: idIngredienteOriginal,
                        id_sustituto: nuevoIngrediente.id_ingrediente
                    },
                    update: {
                        id_ingrediente: idIngredienteOriginal,
                        id_sustituto: nuevoIngrediente.id_ingrediente
                    }
                });

                // Se actualiza la relación plan_ingrediente con el sustituto. Su estado pasa a false
                const planIngrediente = await tx.plan_Ingrediente.update({
                    data: {
                        id_sustituto: nuevoIngrediente.id_ingrediente,
                        medida_sustituto: medidaSustituto!,
                        estado: false
                    },
                    where: {
                        id_ingrediente_id_plan: {
                            id_plan: data.id_plan,
                            id_ingrediente: idIngredienteOriginal!
                        }
                    }
                });  
                
                // Se registra el sustituto como ingrediente asociado al plan (estado: default(true))
                await tx.plan_Ingrediente.create({
                    data: {
                        id_plan: data.id_plan,
                        id_ingrediente: nuevoIngrediente.id_ingrediente,
                        comida: planIngrediente.comida,
                        medida: medidaSustituto,
                        id_unidad_medida: planIngrediente.id_unidad_medida,
                        grasa: sustituto.grasas,
                        carbohidratos: sustituto.carbohidratos,
                        proteinas: sustituto.proteinas
                    }
                });
            }
        }
    });   
    
    return resultado;
}