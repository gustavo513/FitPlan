import { PrismaClient } from "@prisma/client";
import chatgptReq from "../../config/openai-configure";
import { calcularEdad } from "../../utils/calcularEdad";
import { calcularMetabolismoBasal } from "../../utils/calcularMetabolismoBasal";
import { NotFoundError } from "../../utils/errors/notFoundError";
import { CreatePlanSchema } from "./dto/createPlanSchema";

const prisma = new PrismaClient();

function formatearAfecciones(afecciones: string[]): string {
    let resultado = '';

    for(let i = 0; i < afecciones.length; i++){
        if(i == afecciones.length - 1){
            resultado = resultado + `${afecciones[i]}`;
        }
        else{
            resultado = resultado + `${afecciones[i]}, `;
        }
    }

    return resultado;
}

function formatearPlan(plan: any) {
    const planFormateado = {
        'id': plan.id_plan,
        'fecha': plan.fecha,
        'comidas': plan.ingredientes.map((e: any) => {
            return {
                'comida': e.comida,
                'id_ingrediente': e.id_ingrediente,
                'descripcion': e.ingrediente.descripcion,
                'medida': e.medida,
                'unidad_medida': e.unidad_medida.abreviatura,
                'grasa': e.grasa,
                'proteinas': e.proteinas,
                'carbohidratos': e.carbohidratos,
                'micronutrientes': e.micronutrientes
            }
        }),

    }

    return planFormateado;
}

export const generarPlanService = async(data: CreatePlanSchema, id_usuario: number) => {

    // Obtener perfil del usuario, preferencia alimentaria y afecciones
    const perfil = await prisma.perfil.findFirst({
        where: {
            id_usuario: id_usuario
        },
        include: {
            afeccion: {
                select: {
                    afeccion: true
                }
            },
            pref_alim: {
                select: {
                    prefalim: true
                }
            }
        }
    });

    if(perfil != null){
        
        const afecciones: string[] = perfil?.afeccion.map((e) => e.afeccion.descripcion);

        const afeccionesFormateadas: string = formatearAfecciones(afecciones);

        const preferencia_aliementaria = perfil?.pref_alim.map((item) => item.prefalim.descripcion);

        const edad = calcularEdad(perfil?.fechaNacimiento!);

        const sexo = perfil.genero == 'M'? 'Masculino' : 'Femenino';

        const objetivo = await prisma.objetivo.findMany({where: {id_objetivo: data.id_objetivo}});

        const tipo_ejercicio = await prisma.tipoEjercicio.findMany({where: {id_tipo_ejercicio: data.id_tipo_ejercicio}});

        const metabolismoBasal: number = calcularMetabolismoBasal(perfil?.genero, perfil?.peso, perfil?.altura, edad);

        const message = `Generar un plan de dieta ${preferencia_aliementaria} de ${data.cantidad_comidas} comidas al día para una 
        persona de ${edad} años de edad, género ${sexo}, altura ${perfil.altura} metros y peso ${perfil.peso} kg. Generar un 
        plan de ejercicios de tipo ${tipo_ejercicio[0].descripcion}, entre sus afecciones se incluye: ${afeccionesFormateadas}. Su metabolismo basal es 
        ${metabolismoBasal} calorías. Su objetivo es ${objetivo[0].descripcion}. Se deben incluir detalles de micronutrientes y 
        macronutrientes.`;

        // Resultado del plan generado por la API
        const resultado = await chatgptReq(message);

        if(resultado != null){
            // Se genera el registro de cabecera del plan
            const r = await prisma.$transaction(async (tx) => {
                const plan = await tx.plan.create({
                    data: {
                        fecha: (new Date()).toISOString(),
                        cant_comida: data.cantidad_comidas,
                        peso_inicial: perfil?.peso,
                        id_usuario: id_usuario,
                        id_objetivo: data.id_objetivo
                    }
                });
                
                // Iterar sobre las comidas con sus ingrediente, micro y macronutrientes
                for(const item of resultado.comidas){

                   // Se inserta cada ingrediente. Actualizar si ya existe
                   const ingrediente = await tx.ingrediente.upsert({
                        create: {
                            descripcion: item.ingrediente
                        },
                        update: {
                            descripcion: item.ingrediente
                        },
                        where: {
                            descripcion: item.ingrediente
                        }
                   });
                   
                   // Registrar la unidad de medida del ingrediente. Actualizar si ya existe
                   const unidad_medida = await tx.unidadMedida.upsert({
                        create: {
                            descripcion: item.unidadMedida.descripcion,
                            abreviatura: item.unidadMedida.abreviatura
                        },
                        update: {
                            descripcion: item.unidadMedida.descripcion
                        },
                        where: {
                            abreviatura: item.unidadMedida.abreviatura
                        }
                   });

                   // Asociar cada ingrediente al plan actual y a su unidad de medida
                   const plan_ingrediente = await tx.plan_Ingrediente.create({
                        data: {
                            id_ingrediente: ingrediente.id_ingrediente,
                            id_plan: plan.id_plan,
                            comida: item.comida,
                            medida: item.medida,
                            id_unidad_medida: unidad_medida.id_unidad_medida,
                            grasa: item.grasas,
                            proteinas: item.proteinas,
                            carbohidratos: item.carbohidratos   
                        }
                   });

                   // Registrar cada micronutriente y asociarlo al ingrediente. Actualizar si ya existe
                   for(const m of item.micronutrientes){
                        const micronutriente = await tx.micronutriente.upsert({
                                create: {
                                    descripcion: m
                                },
                                update: {
                                    descripcion: m
                                },
                                where: {
                                    descripcion: m
                                }
                        });

                        await tx.ingrediente_Micronutriente.upsert({
                            create: {
                                id_ingrediente: ingrediente.id_ingrediente,
                                id_micronutriente: micronutriente.id_micronutriente
                            },
                            update: {
                                id_ingrediente: ingrediente.id_ingrediente,
                                id_micronutriente: micronutriente.id_micronutriente
                            },
                            where: {
                                id_ingrediente_id_micronutriente: {
                                    id_ingrediente: ingrediente.id_ingrediente,
                                    id_micronutriente: micronutriente.id_micronutriente                                   
                                }
                            }
                        });
                  }

                }

                // Iterar sobre los suplementos con sus micro y macronutrientes
                for(const item of resultado.suplementos){
                   // Registrar el suplemento. Actualizar si ya existe
                   const suplemento = await tx.suplemento.upsert({
                        create: {
                            descripcion: item.suplemento
                        },
                        update: {
                            descripcion: item.suplemento
                        },
                        where: {
                            descripcion: item.suplemento
                        }
                   });

                   // Registrar la unidad de medida. Actualizar si ya existe
                   const unidad_medida = await tx.unidadMedida.upsert({
                        create: {
                            descripcion: item.unidadMedida.descripcion,
                            abreviatura: item.unidadMedida.abreviatura
                        },
                        update: {
                            abreviatura: item.unidadMedida.abreviatura
                        },
                        where: {
                            abreviatura: item.unidadMedida.abreviatura
                        }
                   });
                   
                   // Asociar cada suplemento con el plan actual
                   const plan_suplemento = await tx.plan_Suplemento.create({
                        data: {
                            id_plan: plan.id_plan,
                            id_suplemento: suplemento.id_suplemento,
                            medida: item.medida,
                            id_unidad_medida: unidad_medida.id_unidad_medida,
                            grasa: item.grasas,
                            proteinas: item.proteinas,
                            carbohidratos: item.carbohidratos
                        }
                   });

                   // Registrar cada micronutriente y asociarlo al suplemento. Actualizar si ya existe
                   for(const m of item.micronutrientes){
                        const micronutriente = await tx.micronutriente.upsert({
                            create: {
                                descripcion: m
                            },
                            update: {
                                descripcion: m
                            },
                            where: {
                                descripcion: m
                            }
                        });

                        await tx.suplemento_Micronutriente.upsert({
                            create: {
                                id_suplemento: suplemento.id_suplemento,
                                id_micronutriente: micronutriente.id_micronutriente
                            },
                            update: {
                                id_suplemento: suplemento.id_suplemento,
                                id_micronutriente: micronutriente.id_micronutriente
                            },
                            where: {
                                id_suplemento_id_micronutriente: {
                                    id_suplemento: suplemento.id_suplemento,
                                    id_micronutriente: micronutriente.id_micronutriente                                   
                                }
                            }
                        });
                   }
                }

                // Iterar sobre los ejercicios
                for(const item of resultado.ejercicios){
                    // Registrar cada ejercicio. Actualizar si ya existe
                    const ejercicio = await tx.ejercicio.upsert({
                        create: {
                            descripcion: item.ejercicio,
                            id_tipo_ejercicio: data.id_tipo_ejercicio
                        },
                        update: {
                            descripcion: item.ejercicio
                        },
                        where: {
                            descripcion: item.ejercicio
                        }
                    });

                    // Asociar cada ejercicio con el plan actual
                    const plan_ejercicio = await tx.plan_Ejercicio.create({
                        data: {
                            id_plan: plan.id_plan,
                            id_ejercicio: ejercicio.id_ejercicio,
                            duracion: item.duracion,
                            peso: item.peso
                        }
                    });
                }
            });

            return resultado;
        }
    }
    else{
        throw new NotFoundError('Perfil no encontrado');
    }
}

export const obtenerPlanActualService = async (id_usuario: number) => {

    // Obtener el plan activo, o vencido para generar nuevo plan
    const plan = await prisma.plan.findMany({
        where: {
            OR: [
                {
                    estado: 1,
                    id_usuario: id_usuario
                },
                {
                    estado: 2,
                    id_usuario: id_usuario
                }
            ]
        },
        include: {
            ejercicios: {
                select: {
                    ejercicio: true,
                    duracion: true,
                    peso: true
                }
            },
            ingredientes: {
                select: {
                    id_ingrediente: true,
                    ingrediente: true,
                    medida: true,
                    unidad_medida: true,
                    grasa: true,
                    proteinas: true,
                    carbohidratos: true,
                },
            },
            suplementos: {
                select: {
                    id_suplemento: true,
                    suplemento: {
                        select: {
                            descripcion: true
                        }
                    },
                    medida: true,
                    unidad_medida: true
                }
            }
        }
    });

    if(plan != null){
        /* const planFormateado = formatearPlan(plan[0]);
        console.log(planFormateado);
        return planFormateado;*/
        return plan;
    }
    else{
        throw new NotFoundError('No se encontró ningún plan vigente');
    }
} 

export const actualizarPlanService = async (id_plan: number, peso_final: number, calificacion: number, comentario: string) => {
    // Se actualiza el plan vencido con el peso del usuario al finalizar el plan,
    // la calificación proporcionada y un comentario (opcional). Luego, el estado
    // del plan pasa a Inactivo (estado 3)
    const resultado = await prisma.plan.update({
        data: {
            peso_final: peso_final,
            calificacion: calificacion,
            comentario: comentario,
            estado: 3
        },
        where: {
            id_plan: id_plan,
            estado: 2
        }
    });

    return resultado;
}