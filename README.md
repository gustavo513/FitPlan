-- Clonar el repositorio

git clone https://github.com/gustavo513/FitPlan

-- Instalar las dependencias

npm install

-- Establecer las variables de entorno en el archivo .env

DATABASE_URL=" "

JWT_SECRET_KEY=" "

GOOGLE_CLIENT_ID=" "

GOOGLE_CLIENT_SECRET=" "

-- Migrar el esquema Prisma a la base de datos

npx prisma migrate dev --name init

-- Ejecutar el servidor

npm run dev

