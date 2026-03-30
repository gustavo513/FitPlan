import { PrismaClient } from "@prisma/client";
import nodeCron from "node-cron";
import chatgptReq from "../../config/openai-configure";
import { ComposicionIngredienteDto } from "../../shared/dto/composicionIngredienteDto";
import { ComposicionSuplementoDto } from "../../shared/dto/composicionSuplementoDto";
import { EjercicioDto } from "../../shared/dto/ejercicioDto";
import { Plan } from "../../types/openai.types";
import { calcularEdad } from "../../utils/calcularEdad";
import { calcularMetabolismoBasal } from "../../utils/calcularMetabolismoBasal";
import { NotFoundError } from "../../utils/errors/notFoundError";
import { CreatePlanSchema } from "./dto/createPlanSchema";
import { PlanDto } from "./dto/planDto";

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
                    id_pref_alim: true,
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

        /*const message = `Generar un plan de dieta ${preferencia_aliementaria} de ${data.cantidad_comidas} comidas al día para una 
        persona de ${edad} años de edad, género ${sexo}, altura ${perfil.altura} metros y peso ${perfil.peso} kg. Generar un 
        plan de ejercicios de tipo ${tipo_ejercicio[0].descripcion}, entre sus afecciones se incluye: ${afeccionesFormateadas}. Su metabolismo basal es 
        ${metabolismoBasal} calorías. Su objetivo es ${objetivo[0].descripcion}. Se deben incluir detalles de micronutrientes y 
        macronutrientes. Esta persona vive en Paraguay`;*/

        const message = `
                OBJETIVO:
                Generar un plan completamente personalizado de nutrición y entrenamiento basado en los datos proporcionados.

                INPUT:
                - Preferencia alimentaria: ${preferencia_aliementaria}
                - Cantidad de comidas: ${data.cantidad_comidas}
                - Edad: ${edad}
                - Sexo: ${sexo}
                - Altura: ${perfil.altura} (m)
                - Peso: ${perfil.peso} (kg)
                - Tipo de entrenamiento: ${tipo_ejercicio[0].descripcion}
                - Afecciones: ${afeccionesFormateadas}
                - Metabolismo basal: ${metabolismoBasal} kcal
                - Objetivo: ${objetivo[0].descripcion}
                - País: Paraguay

                INSTRUCCIONES:

                1. CALCULAR:
                - Gasto energético total (GET) usando factor de actividad adecuado.
                - Déficit o superávit calórico según objetivo:
                - Definición: déficit moderado (15–25%)
                - Volumen: superávit controlado (5–15%)
                - Recomposición: mantenimiento o leve ajuste

                2. DISTRIBUCIÓN DE MACRONUTRIENTES:
                - Proteína: 1.8 – 2.5 g/kg
                - Grasas: 0.8 – 1 g/kg
                - Carbohidratos: restante calórico
                - Mostrar en:
                - gramos
                - kcal
                - porcentaje

                3. MICRONUTRIENTES:
                - Incluir recomendaciones de:
                - fibra (g/día)
                - sodio
                - potasio
                - hidratación
                - Ajustar según afecciones si existen

                4. PLAN ALIMENTICIO:
                Generar ${data.cantidad_comidas} comidas estructuradas con:
                - Opciones intercambiables
                - Cantidades exactas en gramos
                - Alimentos accesibles en Paraguay:
                (ej: arroz, mandioca, carne, pollo, huevo, pan, frutas locales, etc.)

                Formato por comida:
                - Nombre de comida
                - Alimentos + gramos
                - Alternativas equivalentes

                5. PLAN DE ENTRENAMIENTO:
                Basado en: ${tipo_ejercicio[0].descripcion}

                Incluir:
                - Frecuencia semanal
                - División muscular
                - Volumen (series efectivas)
                - Rango de repeticiones
                - Intensidad (RIR / fallo)
                - Métodos avanzados (opcional: cluster, back-off, etc.)
                - Progresión semanal

                6. SUPLEMENTACIÓN (opcional pero recomendada):
                - Creatina
                - Proteína whey
                - Omega 3
                - Vitamina D
                - Otros según objetivo

                7. ESTRATEGIA DE SEGUIMIENTO:
                - Indicadores clave:
                - peso
                - medidas
                - rendimiento
                - Ajustes cada 2 semanas

                8. OUTPUT FORMAT:
                Responder en formato estructurado claro:

                SECCIONES:
                1. Resumen del paciente
                2. Calorías y macros
                3. Plan alimenticio
                4. Micronutrientes
                5. Entrenamiento
                6. Suplementación
                7. Estrategia de seguimiento

                IMPORTANTE:
                - Ser específico, técnico y aplicable.
                - Evitar generalidades.
                - No usar lenguaje ambiguo.
                `;

console.log(message);
        // Resultado del plan generado por la API
        const resultado = await chatgptReq(message, Plan);

        if(resultado != null){
            // Se genera el registro de cabecera del plan
            const r = await prisma.$transaction(async (tx) => {
                const plan = await tx.plan.create({
                    data: {
                        fecha: (new Date()).toISOString(),
                        fecha_registro: (new Date()).toISOString(),
                        cant_comida: data.cantidad_comidas,
                        peso_inicial: perfil?.peso,
                        id_usuario: id_usuario,
                        id_objetivo: data.id_objetivo,
                        id_preferencia_alimentaria: perfil?.pref_alim[0].id_pref_alim
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
    const plan = await prisma.plan.findFirst({
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
            objetivo: {
                select: {
                    id_objetivo: true,
                    descripcion: true
                }
            },
            preferencia_alimentaria: {
                select: {
                    id_pref_alim: true,
                    descripcion: true
                }
            },
            ejercicios: {
                select: {
                    ejercicio: true,
                    duracion: true,
                    peso: true
                }
            },
            ingredientes: {
                where: {
                    estado: true
                },
                select: {
                    comida: true,
                    id_ingrediente: true,
                    ingrediente: true,
                    medida: true,
                    unidad_medida: true,
                    grasa: true,
                    proteinas: true,
                    carbohidratos: true,
                    id_sustituto: true,
                    medida_sustituto: true,
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
        // Obtener los micronutrientes de los ingredientes
        const ingredientes: ComposicionIngredienteDto[] = [];
        for(const ingrediente of plan.ingredientes){
            const micronutrientes = await prisma.ingrediente_Micronutriente.findMany({
                where: {
                    id_ingrediente: ingrediente.id_ingrediente
                },
                include: {
                    micronutriente: {
                        select: {
                            descripcion: true
                        }
                    }
                }
            });

            const resultado: ComposicionIngredienteDto = new ComposicionIngredienteDto(
                ingrediente.comida,
                ingrediente.id_ingrediente,                
                ingrediente.ingrediente.descripcion,
                ingrediente.medida,
                ingrediente.unidad_medida.descripcion,
                ingrediente.unidad_medida.abreviatura,
                ingrediente.proteinas,
                ingrediente.carbohidratos,
                ingrediente.grasa,
                micronutrientes.map((e) => e.micronutriente.descripcion),
                ingrediente.id_sustituto?? undefined,
                undefined,
                ingrediente.medida_sustituto?? undefined
            );

            ingredientes.push(resultado);
        }

        // Obtener los micronutrientes de los suplementos
        const suplementos: ComposicionSuplementoDto[] = [];
        for(const suplemento of plan.suplementos){
            const micronutrientes = await prisma.suplemento_Micronutriente.findMany({
                where: {
                    id_suplemento: suplemento.id_suplemento
                },
                include: {
                    micronutriente: {
                        select: {
                            descripcion: true
                        }
                    }
                }
            }); 

            const resultado: ComposicionSuplementoDto = new ComposicionSuplementoDto(
                suplemento.id_suplemento,
                suplemento.suplemento.descripcion,
                suplemento.medida,
                suplemento.unidad_medida.descripcion,
                suplemento.unidad_medida.abreviatura,
                micronutrientes.map((e) => e.micronutriente.descripcion)
            );

            suplementos.push(resultado);
        }

        // Formatear ejercicios
        const ejercicios: EjercicioDto[] = [];
        for(const ejercicio of plan.ejercicios){
            const e = new EjercicioDto(
                ejercicio.ejercicio.id_ejercicio,
                ejercicio.ejercicio.descripcion,
                ejercicio.duracion,
                ejercicio.peso?? undefined
            );

            ejercicios.push(e);
        }

        const planFormateado: PlanDto = new PlanDto(
                plan.id_plan,
                plan.objetivo.descripcion,
                plan.preferencia_alimentaria.descripcion,
                plan.fecha,
                plan.cant_comida,
                plan.peso_inicial,
                ingredientes,
                suplementos,
                ejercicios,
                plan.peso_final?? undefined,
                plan.calificacion?? undefined,
                plan.comentario?? undefined,
        );

        return planFormateado;
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

// Función que se ejecuta todos los días a las 00:00:00 hs
// para verificar y actualizar los planes vencidos
nodeCron.schedule('0 0 0 * * *', async () => {
    console.log('Iniciando verificación de planes vencidos...');
    
    // Fecha actual menos 30 días para actualizar el 
    // estado de los planes a vencidos. 
    let fecha = new Date();

    fecha.setDate(fecha.getDate() - 30);

    const fechaVencimiento = fecha.toISOString().slice(0, 10);
    
    await prisma.plan.updateMany({
        data: {
            estado: 2
        },
        where: {
            fecha: new Date(fechaVencimiento)
        }
    });
});