# 🚗 Transferencia de Automotor - Backend

Backend para el módulo de "Transferencia de Automotor" del sistema tributario, desarrollado con **NestJS** y **arquitectura hexagonal**.

## 🏗️ Arquitectura

Este proyecto implementa la **arquitectura hexagonal (puertos y adaptadores)** con la siguiente estructura:

```
src/automotor/
├── domain/                    # 🧠 Dominio (reglas de negocio)
│   └── ports/                # 🔌 Interfaces (puertos)
├── application/              # 📋 Aplicación (casos de uso)
│   └── services/            # 🎯 Servicios de aplicación
└── infrastructure/          # 🔧 Infraestructura (adaptadores)
    ├── controllers/         # 🌐 Controladores REST
    ├── repositories/        # 💾 Repositorios TypeORM
    ├── entities/           # 🗄️ Entidades de base de datos
    ├── dto/               # 📝 DTOs de validación
    ├── services/          # 🔧 Servicios de infraestructura
    └── data/              # 📊 Datos de ejemplo
```

### 🧩 Componentes de la Arquitectura Hexagonal

- **Dominio**: Contiene las entidades y reglas de negocio puras
- **Puertos**: Interfaces que definen contratos entre capas
- **Aplicación**: Implementa los casos de uso y lógica de negocio
- **Adaptadores**: Implementaciones concretas (repositorios, controladores)

## � Docker Setup

### Prerrequisitos

- Docker Desktop instalado
- Docker Compose (incluido en Docker Desktop)

### 🚀 Inicio Rápido con Docker

#### 1. Solo Base de Datos (Para desarrollo local)

```bash
# Iniciar solo la base de datos SQL Server
docker-compose -f docker-compose.dev.yml up -d

# La base de datos estará disponible en:
# Host: localhost
# Puerto: 1433
# Usuario: sa
# Contraseña: TransferApp2024!
# Base de datos: TransferenciaAutomotor (se crea automáticamente)
```

#### 2. Aplicación Completa (Producción)

```bash
# Construir e iniciar toda la aplicación
docker-compose up --build

# En modo separado (background)
docker-compose up --build -d

# Ver logs
docker-compose logs -f app
```

### 🛠️ Comandos Docker Útiles

```bash
# Detener los contenedores
docker-compose down

# Eliminar volúmenes (¡CUIDADO! Esto elimina los datos)
docker-compose down -v

# Reconstruir la aplicación
docker-compose build app

# Conectarse a la base de datos desde un cliente externo
# Servidor: localhost,1433
# Usuario: sa
# Contraseña: TransferApp2024!
```

### 📋 Variables de Entorno

El archivo `.env` contiene las siguientes configuraciones:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=TransferApp2024!
DB_DATABASE=TransferenciaAutomotor

# Application Configuration
NODE_ENV=development
PORT=3000
```

**Credenciales por defecto:**
- Usuario: `sa`
- Contraseña: `TransferApp2024!`
- Base de datos: `TransferenciaAutomotor`

## �🚀 Instalación Manual (Sin Docker)

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- SQL Server (local o remoto)

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd transferencia-automotor-backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Copiar el archivo de ejemplo
   cp .env.example .env
   
   # Editar el archivo .env con tus configuraciones
   ```

3. **Levantar el proyecto**
   ```bash
   npm run start:dev
   ```

4. **Acceder a la documentación**
   - Swagger UI: http://localhost:3000/api
   - API Base: http://localhost:3000

## 📚 Endpoints Disponibles

### 1. Consultar Automotor por Dominio
```http
GET /automotor/consultar/:dominio
```

**Ejemplo:**
```bash
curl http://localhost:3000/automotor/consultar/ABC123
```

**Respuesta:**
```json
{
  "modelo": "Gol Trend",
  "codigoAlta": 12345,
  "registroId": 67890,
  "marca": "Volkswagen",
  "fechaAlta": "2020-01-15",
  "fechaVigencia": "2024-01-01",
  "valorVigente": 1500000.00
}
```

### 2. Obtener Titular Actual
```http
GET /automotor/titular/:ovpId
```

**Ejemplo:**
```bash
curl http://localhost:3000/automotor/titular/1
```

**Respuesta:**
```json
{
  "cuit": "20-12345678-9",
  "razonSocial": "Juan Pérez",
  "porcentaje": 100.00,
  "responsable": "Sí"
}
```

### 3. Registrar Transferencia
```http
POST /automotor/transferencia/:ovpId
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/automotor/transferencia/1 \
  -H "Content-Type: application/json" \
  -d '{
    "cuit": "20-87654321-0",
    "porcentaje": 100,
    "fechaInicio": "2024-01-15",
    "responsable": true
  }'
```

**Respuesta:**
```json
{
  "mensaje": "✔ Transferencia registrada correctamente.",
  "transferencia": {
    "id": 2,
    "nuevoTitular": {
      "cuit": "20-87654321-0",
      "razonSocial": "María González"
    },
    "fechaInicio": "2024-01-15",
    "porcentaje": 100.00,
    "responsable": "Sí"
  }
}
```

## 🧪 Testing

### Ejecutar tests unitarios
```bash
npm test
```

### Ejecutar tests en modo watch
```bash
npm run test:watch
```

### Ejecutar tests con cobertura
```bash
npm run test:cov
```

## 📊 Datos de Ejemplo

El sistema incluye datos de ejemplo que se cargan automáticamente al iniciar:

### Automotores
- **ABC123**: Volkswagen Gol Trend
- **XYZ789**: Toyota Corolla  
- **DEF456**: Honda Civic

### Sujetos Pasivos (CUITs)
- **20-12345678-9**: Juan Pérez
- **20-87654321-0**: María González
- **20-11111111-1**: Carlos Rodríguez
- **20-22222222-2**: Ana Martínez

## 🔧 Configuración

### Base de Datos
El proyecto utiliza SQLite en memoria para desarrollo. Para producción, modifica la configuración en `src/app.module.ts`:

```typescript
TypeOrmModule.forRoot({
  type: 'postgres', // o 'mysql', 'sqlserver'
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'transferencia_automotor',
  entities: [/* ... */],
  synchronize: false, // false en producción
})
```

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
NODE_ENV=development
```

## 📋 Funcionalidades Implementadas

### ✅ Consulta de Automotor
- Búsqueda por dominio
- Filtrado de registros dados de baja
- Información completa del vehículo
- Valor vigente del automotor

### ✅ Visualización de Titular Actual
- Información del titular vigente
- Porcentaje de copropiedad
- Indicador de responsable

### ✅ Ingreso de Nuevo Titular
- Validación de CUIT existente
- Validación de porcentaje (1-100)
- Validación de fecha de inicio
- Indicador de responsable

### ✅ Registro de Transferencia
- Creación de nuevo vínculo
- Cierre automático del vínculo anterior
- Validaciones de negocio
- Confirmación de operación

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Servidor en modo desarrollo
npm run start:debug        # Servidor con debug

# Producción
npm run build             # Compilar proyecto
npm run start:prod        # Servidor en producción

# Testing
npm test                  # Tests unitarios
npm run test:watch        # Tests en modo watch
npm run test:cov          # Tests con cobertura

# Linting y formateo
npm run lint              # Ejecutar ESLint
npm run format            # Formatear código con Prettier
```

## 📖 Documentación API

La documentación completa de la API está disponible en Swagger UI:
- **URL**: http://localhost:3000/api
- **Incluye**: Todos los endpoints, esquemas de request/response, ejemplos

## 🏛️ Estructura de Base de Datos

### Tablas Principales

1. **AUTOMOTORES**: Información de vehículos
2. **SUJETOS_PASIVOS**: Contribuyentes/titulares
3. **OBJETOS_VALOR_PREDETERMINADO**: Valores de automotores
4. **VINCULOS_SUJETO_OBJETO**: Relación titular-automotor

### Relaciones
- Un automotor puede tener múltiples valores predeterminados
- Un sujeto pasivo puede ser titular de múltiples automotores
- Los vínculos mantienen el historial de titularidad

