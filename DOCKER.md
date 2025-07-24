# Instrucciones para Docker con NPM Scripts

Este documento resume los pasos y scripts necesarios para levantar y gestionar tu stack de Docker (SQL Server + NestJS) usando los comandos definidos en `package.json`.

## Prerrequisitos

* Docker y Docker Compose instalados.
* Node.js y NPM instalados (para ejecutar los scripts).

## Scripts NPM disponibles

| Script                   | Descripción                                                    |
| ------------------------ | -------------------------------------------------------------- |
| `npm run docker:db`      | Levanta el contenedor de base de datos (modo desarrollo).      |
| `npm run db:init`        | Crea la base `TransferenciaAutomotor` si no existe.            |
| `npm run migration:run`  | Ejecuta las migraciones de TypeORM.                            |
| `npm run seed:run`       | Inserta datos de prueba (seeders).                             |
| `npm run docker:build`   | Construye las imágenes Docker (`db` y `app`).                  |
| `npm run docker:up`      | Levanta todos los servicios definidos en `docker-compose.yml`. |
| `npm run docker:logs`    | Muestra los logs de la aplicación NestJS en tiempo real.       |
| `npm run docker:down`    | Detiene y elimina todos los contenedores del proyecto.         |
| `npm run docker:db:stop` | Detiene el contenedor de base de datos (desarrollo).           |

## Flujo de ejecución recomendado

```bash
# 1. Levantar el contenedor de base de datos (dev)
npm run docker:db

# 2. Crear la base de datos si no existe
npm run db:init

# 3. Ejecutar migraciones (TypeORM)
npm run migration:run

# 4. Sembrar datos de prueba
npm run seed:run

# 5. Construir imágenes Docker
docker-compose build
# o usando el script:
npm run docker:build

# 6. Levantar toda la infraestructura (DB + app)
npm run docker:up

# 7. Ver logs de la aplicación NestJS
npm run docker:logs
```

## Detalles adicionales

* El script `db:init` utiliza:

  ```sql
  IF DB_ID('TransferenciaAutomotor') IS NULL
    CREATE DATABASE TransferenciaAutomotor;
  ```

  para no fallar si la base ya existe.

* Puedes ajustar las variables de entorno (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`) en un archivo `.env` y adaptar el `docker-compose.yml` si es necesario.

* Para entornos de CI/CD, integra estos pasos en tu pipeline antes de desplegar la aplicación.
