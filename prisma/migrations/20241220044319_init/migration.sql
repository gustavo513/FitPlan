-- CreateTable
CREATE TABLE "Persona" (
    "id_persona" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id_persona")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre_usuario" TEXT NOT NULL,
    "contrasenia" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_persona" INTEGER,
    "id_rol" INTEGER NOT NULL DEFAULT 1,
    "id_supervisor" INTEGER,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Autenticacion" (
    "id_autenticacion" SERIAL NOT NULL,
    "proveedor" INTEGER NOT NULL,
    "id_externo" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Rol" (
    "id_rol" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Sugerencia" (
    "id_sugerencia" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comentario" TEXT,
    "id_usuario" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Perfil" (
    "id_perfil" SERIAL NOT NULL,
    "genero" INTEGER NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "altura" DOUBLE PRECISION NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_ciudad" INTEGER
);

-- CreateTable
CREATE TABLE "PrefAlim" (
    "id_pref_alim" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Afeccion" (
    "id_afeccion" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Ciudad" (
    "id_ciudad" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "id_region" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Region" (
    "id_region" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "id_pais" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Pais" (
    "id_pais" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Perfil_PrefAlim" (
    "id_perfil" INTEGER NOT NULL,
    "id_pref_alim" INTEGER NOT NULL,

    CONSTRAINT "Perfil_PrefAlim_pkey" PRIMARY KEY ("id_perfil","id_pref_alim")
);

-- CreateTable
CREATE TABLE "Perfil_Afeccion" (
    "id_perfil" INTEGER NOT NULL,
    "id_afeccion" INTEGER NOT NULL,

    CONSTRAINT "Perfil_Afeccion_pkey" PRIMARY KEY ("id_perfil","id_afeccion")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id_plan" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cant_comida" INTEGER NOT NULL,
    "peso_inicial" DOUBLE PRECISION NOT NULL,
    "peso_final" DOUBLE PRECISION NOT NULL,
    "calificacion" DOUBLE PRECISION NOT NULL,
    "comentario" TEXT,
    "estado" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_objetivo" INTEGER NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id_plan")
);

-- CreateTable
CREATE TABLE "Supervision_Plan" (
    "id_supervisor" INTEGER NOT NULL,
    "id_plan" INTEGER NOT NULL,

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
    "descripcion" TEXT NOT NULL
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
    "descripcion" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UnidadMedida" (
    "id_unidad_medida" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "abreviatura" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Micronutriente" (
    "id_micronutriente" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL
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
CREATE UNIQUE INDEX "Usuario_nombre_usuario_key" ON "Usuario"("nombre_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_id_persona_key" ON "Usuario"("id_persona");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_id_supervisor_key" ON "Usuario"("id_supervisor");

-- CreateIndex
CREATE UNIQUE INDEX "Autenticacion_id_autenticacion_key" ON "Autenticacion"("id_autenticacion");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_id_rol_key" ON "Rol"("id_rol");

-- CreateIndex
CREATE UNIQUE INDEX "Sugerencia_id_sugerencia_key" ON "Sugerencia"("id_sugerencia");

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_id_perfil_key" ON "Perfil"("id_perfil");

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_id_usuario_key" ON "Perfil"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "PrefAlim_id_pref_alim_key" ON "PrefAlim"("id_pref_alim");

-- CreateIndex
CREATE UNIQUE INDEX "Afeccion_id_afeccion_key" ON "Afeccion"("id_afeccion");

-- CreateIndex
CREATE UNIQUE INDEX "Ciudad_id_ciudad_key" ON "Ciudad"("id_ciudad");

-- CreateIndex
CREATE UNIQUE INDEX "Region_id_region_key" ON "Region"("id_region");

-- CreateIndex
CREATE UNIQUE INDEX "Pais_id_pais_key" ON "Pais"("id_pais");

-- CreateIndex
CREATE UNIQUE INDEX "Ingrediente_id_ingrediente_key" ON "Ingrediente"("id_ingrediente");

-- CreateIndex
CREATE UNIQUE INDEX "Suplemento_id_suplemento_key" ON "Suplemento"("id_suplemento");

-- CreateIndex
CREATE UNIQUE INDEX "UnidadMedida_id_unidad_medida_key" ON "UnidadMedida"("id_unidad_medida");

-- CreateIndex
CREATE UNIQUE INDEX "Micronutriente_id_micronutriente_key" ON "Micronutriente"("id_micronutriente");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_persona_fkey" FOREIGN KEY ("id_persona") REFERENCES "Persona"("id_persona") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_supervisor_fkey" FOREIGN KEY ("id_supervisor") REFERENCES "Usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Autenticacion" ADD CONSTRAINT "Autenticacion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

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
