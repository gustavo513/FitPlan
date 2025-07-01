-- Versión de Node.js: 22.6.0

-- Clonar el repositorio

git clone https://github.com/gustavo513/FitPlan

-- Instalar las dependencias en /FitPlan

npm install

-- Establecer las variables de entorno en el archivo /FitPlan/.env

DATABASE_URL=" "

JWT_SECRET_KEY=" " //cada desarrollador establece uno

GOOGLE_CLIENT_ID=" " //credencial generado por Google en APIs & Services de console.cloud.google

GOOGLE_CLIENT_SECRET=" " //credencial generado por Google en APIs & Services de console.cloud.google

EMAIL_USER = " " //correo para servicios de soporte como restablecimiento de contraseñas o verifición de correo

PASS_USER = " " //contraseña de aplicación generada por Google

-- Transpilar los archivos Typescript a Javascript ejecutando el comando correspondiente en /FitPlan

npm run build

-- Migrar el esquema Prisma a la base de datos

npx prisma migrate dev --name init

-- Ejecutar el servidor

npm run dev

-- Ejecutar los siguiente comandos en PostgreSQL:

    -- ROLES
INSERT INTO public."Rol"(descripcion) VALUES ('Estándar');
INSERT INTO public."Rol"(descripcion) VALUES ('Supervisor');

    -- CIUDAD, REGIÓN Y PAÍS
INSERT INTO public."Pais"(nombre) VALUES ('Paraguay');
INSERT INTO public."Region"(nombre, id_pais) VALUES ('Alto Paraná', 1);
INSERT INTO public."Ciudad"(nombre, id_region) VALUES ('Ciudad del Este', 1);

    -- PREFERENCIAS ALIMENTARIAS
INSERT INTO public."PrefAlim"(descripcion) VALUES ('Omnívoro');
INSERT INTO public."PrefAlim"(descripcion) VALUES ('Vegetariano');
INSERT INTO public."PrefAlim"(descripcion) VALUES ('Vegano');

    -- OBJETIVOS
INSERT INTO public."Objetivo"(descripcion) VALUES ('Bajar de peso');
INSERT INTO public."Objetivo"(descripcion) VALUES ('Mantener masa corporal');
INSERT INTO public."Objetivo"(descripcion) VALUES ('Aumentar masa muscular');

    -- TIPOS DE EJERCICIOS
INSERT INTO public."TipoEjercicio"(descripcion) VALUES ('Cardio');
INSERT INTO public."TipoEjercicio"(descripcion) VALUES ('Fuerza');


