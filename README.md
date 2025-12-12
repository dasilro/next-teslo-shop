# Descripción
Imitación de tienda web de Tesla

## Ejecutar en dev

1. Clonar el repositorio
2. Crear una copia del archivo .env.template y renombrarlo a .env y cambiar las variables de entorno.
3. Instalar dependencias ```npm install```
4. Levantar la base de datos ```docker compose up -d```
5. Ejecutar las migraciones de prisma ```npx prisma migrate dev```
6. Ejecutar seed ```npm run seed```
7. Ejecutar el proyecto ```npm run dev```
8. Limpiar el localStorage y las cookies del navegador.

# Ejecutar en prod

