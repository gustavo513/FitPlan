-- Versión de Node.js: 22.6.0

-- Clonar el repositorio

git clone https://github.com/gustavo513/FitPlan

-- Instalar las dependencias

npm install

-- Establecer las variables de entorno en el archivo /FitPlan/.env

DATABASE_URL=" "

JWT_SECRET_KEY=" " //cada desarrollador establece uno

GOOGLE_CLIENT_ID=" " //credencial generado por Google en APIs & Services de console.cloud.google

GOOGLE_CLIENT_SECRET=" " //credencial generado por Google en APIs & Services de console.cloud.google

EMAIL_USER = " " //correo para servicios de soporte como restablecimiento de contraseñas o verifición de correo

PASS_USER = " " //contraseña de aplicación generada por Google

-- Migrar el esquema Prisma a la base de datos

npx prisma migrate dev --name init

-- Ejecutar el servidor

npm run dev

-- Ejecutar los siguiente comandos en PostgreSQL:

ROLES
INSERT INTO public."Rol"(descripcion) VALUES ('Estándar');
INSERT INTO public."Rol"(descripcion) VALUES ('Supervisor');

CIUDAD, REGIÓN Y PAÍS
INSERT INTO public."Pais"(nombre) VALUES ('Paraguay');
INSERT INTO public."Region"(nombre, id_pais) VALUES ('Alto Paraná', 1);
INSERT INTO public."Ciudad"(nombre, id_region) VALUES ('Ciudad del Este', 1);
