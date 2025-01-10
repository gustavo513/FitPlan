-- Versión de Node.js: 22.6.0

-- Clonar el repositorio

git clone https://github.com/gustavo513/FitPlan

-- Instalar las dependencias

npm install

-- Establecer las variables de entorno en el archivo /FitPlan/.env

DATABASE_URL=" "

JWT_SECRET_KEY=" "

GOOGLE_CLIENT_ID=" "

GOOGLE_CLIENT_SECRET=" "

-- Migrar el esquema Prisma a la base de datos

npx prisma migrate dev --name init

-- Ejecutar el servidor

npm run dev

-- Ejecutar los siguiente comandos en PostgreSQL:

INSERT INTO public."Rol"(descripcion) VALUES ('Estándar');
INSERT INTO public."Rol"(descripcion) VALUES ('Supervisor');