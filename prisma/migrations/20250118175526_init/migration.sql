-- CreateEnum
CREATE TYPE "SolicitudEstado" AS ENUM ('P', 'A', 'R', 'C');

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "email" TEXT,
    "nombre_usuario" TEXT,
    "contrasenia" TEXT,
    "confirm_email" INTEGER NOT NULL DEFAULT 0,
    "token" TEXT,
    "token_expiracion" TIMESTAMP(3),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_ult_sesion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_eliminacion" TIMESTAMP(3),
    "estado" INTEGER NOT NULL DEFAULT 0,
    "id_rol" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Usuario_Supervisor" (
    "id_estandar" INTEGER NOT NULL,
    "id_supervisor" INTEGER NOT NULL,
    "fecha_conexion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Usuario_Supervisor_pkey" PRIMARY KEY ("id_estandar","id_supervisor")
);

-- CreateTable
CREATE TABLE "SolicitudSupervision" (
    "id_solicitud" SERIAL NOT NULL,
    "id_supervisor" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "SolicitudEstado" NOT NULL DEFAULT 'P',
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "SolicitudSupervision_pkey" PRIMARY KEY ("id_solicitud")
);

-- CreateTable
CREATE TABLE "MetodoAut" (
    "id_proveedor" INTEGER NOT NULL,
    "id_externo" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "MetodoAut_pkey" PRIMARY KEY ("id_proveedor","id_externo")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id_rol" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "Sugerencia" (
    "id_sugerencia" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comentario" TEXT,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "Sugerencia_pkey" PRIMARY KEY ("id_sugerencia")
);

-- CreateTable
CREATE TABLE "Perfil" (
    "id_perfil" SERIAL NOT NULL,
    "nombre" TEXT,
    "apellido" TEXT,
    "genero" INTEGER NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "altura" DOUBLE PRECISION NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_ciudad" INTEGER,

    CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id_perfil")
);

-- CreateTable
CREATE TABLE "PrefAlim" (
    "id_pref_alim" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "PrefAlim_pkey" PRIMARY KEY ("id_pref_alim")
);

-- CreateTable
CREATE TABLE "Afeccion" (
    "id_afeccion" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Afeccion_pkey" PRIMARY KEY ("id_afeccion")
);

-- CreateTable
CREATE TABLE "Ciudad" (
    "id_ciudad" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "id_region" INTEGER NOT NULL,

    CONSTRAINT "Ciudad_pkey" PRIMARY KEY ("id_ciudad")
);

-- CreateTable
CREATE TABLE "Region" (
    "id_region" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "id_pais" INTEGER NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id_region")
);

-- CreateTable
CREATE TABLE "Pais" (
    "id_pais" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Pais_pkey" PRIMARY KEY ("id_pais")
);

-- CreateTable
CREATE TABLE "Perfil_PrefAlim" (
    "id_perf_prefalim" SERIAL NOT NULL,
    "id_perfil" INTEGER NOT NULL,
    "id_pref_alim" INTEGER NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3),
    "estado" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Perfil_PrefAlim_pkey" PRIMARY KEY ("id_perf_prefalim")
);

-- CreateTable
CREATE TABLE "Perfil_Afeccion" (
    "id_perf_afec" SERIAL NOT NULL,
    "id_perfil" INTEGER NOT NULL,
    "id_afeccion" INTEGER NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3),
    "estado" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Perfil_Afeccion_pkey" PRIMARY KEY ("id_perf_afec")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id_plan" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cant_comida" INTEGER NOT NULL,
    "peso_inicial" DOUBLE PRECISION NOT NULL,
    "peso_final" DOUBLE PRECISION NOT NULL,
    "estado_peso_final" INTEGER NOT NULL,
    "calificacion" DOUBLE PRECISION NOT NULL,
    "comentario" TEXT,
    "estado_calif" INTEGER NOT NULL,
    "estado" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_objetivo" INTEGER NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id_plan")
);

-- CreateTable
CREATE TABLE "Supervision_Plan" (
    "id_supervisor" INTEGER NOT NULL,
    "id_plan" INTEGER NOT NULL,
    "comentario" TEXT,
    "fecha_comentario" TIMESTAMP(3),

    CONSTRAINT "Supervision_Plan_pkey" PRIMARY KEY ("id_supervisor","id_plan")
);

-- CreateTable
CREATE TABLE "Objetivo" (
    "id_objetivo" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Objetivo_pkey" PRIMARY KEY ("id_objetivo")
);

-- CreateTable
CREATE TABLE "Ejercicio" (
    "id_ejercicio" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "duracion" INTEGER NOT NULL,
    "peso" DOUBLE PRECISION,
    "id_tipo_ejercicio" INTEGER NOT NULL,

    CONSTRAINT "Ejercicio_pkey" PRIMARY KEY ("id_ejercicio")
);

-- CreateTable
CREATE TABLE "TipoEjercicio" (
    "id_tipo_ejercicio" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "TipoEjercicio_pkey" PRIMARY KEY ("id_tipo_ejercicio")
);

-- CreateTable
CREATE TABLE "Plan_Ejercicio" (
    "id_ejercicio" INTEGER NOT NULL,
    "id_plan" INTEGER NOT NULL,

    CONSTRAINT "Plan_Ejercicio_pkey" PRIMARY KEY ("id_ejercicio","id_plan")
);

-- CreateTable
CREATE TABLE "Ingrediente" (
    "id_ingrediente" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Ingrediente_pkey" PRIMARY KEY ("id_ingrediente")
);

-- CreateTable
CREATE TABLE "Plan_Ingrediente" (
    "id_ingrediente" INTEGER NOT NULL,
    "id_plan" INTEGER NOT NULL,
    "comida" INTEGER NOT NULL,
    "medida" DOUBLE PRECISION NOT NULL,
    "id_unidad_medida" INTEGER NOT NULL,
    "grasa" DOUBLE PRECISION NOT NULL,
    "proteinas" DOUBLE PRECISION NOT NULL,
    "carbohidratos" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Plan_Ingrediente_pkey" PRIMARY KEY ("id_ingrediente","id_plan")
);

-- CreateTable
CREATE TABLE "Plan_Suplemento" (
    "id_suplemento" INTEGER NOT NULL,
    "id_plan" INTEGER NOT NULL,
    "medida" DOUBLE PRECISION NOT NULL,
    "id_unidad_medida" INTEGER NOT NULL,
    "grasa" DOUBLE PRECISION NOT NULL,
    "proteinas" DOUBLE PRECISION NOT NULL,
    "carbohidratos" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Plan_Suplemento_pkey" PRIMARY KEY ("id_suplemento","id_plan")
);

-- CreateTable
CREATE TABLE "Suplemento" (
    "id_suplemento" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Suplemento_pkey" PRIMARY KEY ("id_suplemento")
);

-- CreateTable
CREATE TABLE "UnidadMedida" (
    "id_unidad_medida" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "abreviatura" TEXT NOT NULL,

    CONSTRAINT "UnidadMedida_pkey" PRIMARY KEY ("id_unidad_medida")
);

-- CreateTable
CREATE TABLE "Micronutriente" (
    "id_micronutriente" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Micronutriente_pkey" PRIMARY KEY ("id_micronutriente")
);

-- CreateTable
CREATE TABLE "Ingrediente_Micronutriente" (
    "id_ingrediente" INTEGER NOT NULL,
    "id_micronutriente" INTEGER NOT NULL,

    CONSTRAINT "Ingrediente_Micronutriente_pkey" PRIMARY KEY ("id_ingrediente","id_micronutriente")
);

-- CreateTable
CREATE TABLE "Suplemento_Micronutriente" (
    "id_suplemento" INTEGER NOT NULL,
    "id_micronutriente" INTEGER NOT NULL,

    CONSTRAINT "Suplemento_Micronutriente_pkey" PRIMARY KEY ("id_suplemento","id_micronutriente")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_nombre_usuario_key" ON "Usuario"("nombre_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "MetodoAut_id_externo_key" ON "MetodoAut"("id_externo");

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_id_usuario_key" ON "Perfil"("id_usuario");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario_Supervisor" ADD CONSTRAINT "Usuario_Supervisor_id_estandar_fkey" FOREIGN KEY ("id_estandar") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario_Supervisor" ADD CONSTRAINT "Usuario_Supervisor_id_supervisor_fkey" FOREIGN KEY ("id_supervisor") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudSupervision" ADD CONSTRAINT "SolicitudSupervision_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetodoAut" ADD CONSTRAINT "MetodoAut_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sugerencia" ADD CONSTRAINT "Sugerencia_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_id_ciudad_fkey" FOREIGN KEY ("id_ciudad") REFERENCES "Ciudad"("id_ciudad") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ciudad" ADD CONSTRAINT "Ciudad_id_region_fkey" FOREIGN KEY ("id_region") REFERENCES "Region"("id_region") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_id_pais_fkey" FOREIGN KEY ("id_pais") REFERENCES "Pais"("id_pais") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perfil_PrefAlim" ADD CONSTRAINT "Perfil_PrefAlim_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "Perfil"("id_perfil") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perfil_PrefAlim" ADD CONSTRAINT "Perfil_PrefAlim_id_pref_alim_fkey" FOREIGN KEY ("id_pref_alim") REFERENCES "PrefAlim"("id_pref_alim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perfil_Afeccion" ADD CONSTRAINT "Perfil_Afeccion_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "Perfil"("id_perfil") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perfil_Afeccion" ADD CONSTRAINT "Perfil_Afeccion_id_afeccion_fkey" FOREIGN KEY ("id_afeccion") REFERENCES "Afeccion"("id_afeccion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_id_objetivo_fkey" FOREIGN KEY ("id_objetivo") REFERENCES "Objetivo"("id_objetivo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supervision_Plan" ADD CONSTRAINT "Supervision_Plan_id_supervisor_fkey" FOREIGN KEY ("id_supervisor") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supervision_Plan" ADD CONSTRAINT "Supervision_Plan_id_plan_fkey" FOREIGN KEY ("id_plan") REFERENCES "Plan"("id_plan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ejercicio" ADD CONSTRAINT "Ejercicio_id_tipo_ejercicio_fkey" FOREIGN KEY ("id_tipo_ejercicio") REFERENCES "TipoEjercicio"("id_tipo_ejercicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan_Ejercicio" ADD CONSTRAINT "Plan_Ejercicio_id_ejercicio_fkey" FOREIGN KEY ("id_ejercicio") REFERENCES "Ejercicio"("id_ejercicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan_Ejercicio" ADD CONSTRAINT "Plan_Ejercicio_id_plan_fkey" FOREIGN KEY ("id_plan") REFERENCES "Plan"("id_plan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan_Ingrediente" ADD CONSTRAINT "Plan_Ingrediente_id_ingrediente_fkey" FOREIGN KEY ("id_ingrediente") REFERENCES "Ingrediente"("id_ingrediente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan_Ingrediente" ADD CONSTRAINT "Plan_Ingrediente_id_plan_fkey" FOREIGN KEY ("id_plan") REFERENCES "Plan"("id_plan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan_Ingrediente" ADD CONSTRAINT "Plan_Ingrediente_id_unidad_medida_fkey" FOREIGN KEY ("id_unidad_medida") REFERENCES "UnidadMedida"("id_unidad_medida") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan_Suplemento" ADD CONSTRAINT "Plan_Suplemento_id_suplemento_fkey" FOREIGN KEY ("id_suplemento") REFERENCES "Suplemento"("id_suplemento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan_Suplemento" ADD CONSTRAINT "Plan_Suplemento_id_plan_fkey" FOREIGN KEY ("id_plan") REFERENCES "Plan"("id_plan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan_Suplemento" ADD CONSTRAINT "Plan_Suplemento_id_unidad_medida_fkey" FOREIGN KEY ("id_unidad_medida") REFERENCES "UnidadMedida"("id_unidad_medida") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingrediente_Micronutriente" ADD CONSTRAINT "Ingrediente_Micronutriente_id_ingrediente_fkey" FOREIGN KEY ("id_ingrediente") REFERENCES "Ingrediente"("id_ingrediente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingrediente_Micronutriente" ADD CONSTRAINT "Ingrediente_Micronutriente_id_micronutriente_fkey" FOREIGN KEY ("id_micronutriente") REFERENCES "Micronutriente"("id_micronutriente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suplemento_Micronutriente" ADD CONSTRAINT "Suplemento_Micronutriente_id_suplemento_fkey" FOREIGN KEY ("id_suplemento") REFERENCES "Suplemento"("id_suplemento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suplemento_Micronutriente" ADD CONSTRAINT "Suplemento_Micronutriente_id_micronutriente_fkey" FOREIGN KEY ("id_micronutriente") REFERENCES "Micronutriente"("id_micronutriente") ON DELETE RESTRICT ON UPDATE CASCADE;
