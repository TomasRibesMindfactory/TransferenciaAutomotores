# 🐳 Instrucciones Docker - Configuración Simplificada

Este documento describe la configuración Docker simplificada usando **un solo archivo** `docker-compose.yml` con **profiles** para separar entornos.

## 🚀 Prerrequisitos

* Docker y Docker Compose instalados
* Node.js y NPM instalados

## 📊 Scripts NPM Disponibles

### 🛠️ Desarrollo (DB en Docker, App Local)

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Levanta DB en Docker + App local con hot reload |
| `npm run dev:db` | Solo levanta la base de datos en Docker |
| `npm run dev:db:stop` | Detiene la base de datos |
| `npm run dev:logs` | Muestra logs de la base de datos |

### 🚀 Producción (Todo en Docker)

| Script | Descripción |
|--------|-------------|
| `npm run prod` | Levanta toda la aplicación en Docker |
| `npm run prod:stop` | Detiene toda la aplicación |
| `npm run prod:logs` | Muestra logs de la aplicación |
| `npm run prod:rebuild` | Reconstruye y reinicia la aplicación |

### 🔧 Utilidades

| Script | Descripción |
|--------|-------------|
| `npm run db:init` | Crea la base de datos si no existe |
| `npm run db:clean` | Limpia volúmenes y cache Docker |
| `npm run seed:run` | Ejecuta seeders de datos de prueba |
| `npm run migration:run` | Ejecuta migraciones de TypeORM |
## 🎯 Flujos de Trabajo Recomendados

### 🛠️ Desarrollo Diario

```bash
# Opción 1: Todo en un comando
npm run dev

# Opción 2: Paso a paso
npm run dev:db           # Levanta base de datos
npm run db:init          # Crea DB (solo primera vez)
npm run seed:run         # Carga datos (solo primera vez)
npm run start:dev        # Inicia aplicación local

# Ver logs de la base de datos
npm run dev:logs

# Al terminar
npm run dev:db:stop
```

### 🚀 Producción / Testing

```bash
# Levantar toda la aplicación
npm run prod

# Verificar que esté funcionando
npm run prod:logs

# Para actualizaciones de código
npm run prod:rebuild

# Detener cuando no se necesite
npm run prod:stop
```

### 🧹 Mantenimiento

```bash
# Limpiar todo (¡CUIDADO! Elimina datos)
npm run db:clean

# Recrear base de datos
npm run db:init

# Recargar datos de prueba
npm run seed:run
```

## 🔧 Configuración Técnica

### Docker Compose con Profiles

- **Perfil por defecto**: Solo base de datos (desarrollo)
- **Perfil `prod`**: Base de datos + aplicación (producción)

```bash
# Equivalente a npm run dev:db
docker-compose up db -d

# Equivalente a npm run prod
docker-compose --profile prod up --build -d
```

### Health Checks

La base de datos incluye health checks para asegurar disponibilidad:
- Intervalo: 10 segundos
- Timeout: 5 segundos
- Reintentos: 10
- Período de inicio: 10 segundos

## 📋 Variables de Entorno

**Desarrollo (.env):**
```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=TransferApp2024!
DB_DATABASE=TransferenciaAutomotor
```

**Producción (Docker automático):**
Las variables se configuran en docker-compose.yml

## 🚨 Solución de Problemas

```bash
# Ver estado de contenedores
docker ps -a

# Conectarse manualmente a la DB
docker exec -it transferencia-automotor-db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "TransferApp2024!"

# Limpiar todo y empezar de cero
npm run db:clean
docker system prune -f

# Reconstruir solo la aplicación
npm run prod:rebuild
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
