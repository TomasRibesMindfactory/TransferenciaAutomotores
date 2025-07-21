# Nuevo Endpoint de Transferencia con Formulario Completo

## 📋 Endpoint Creado

### `POST /api/automotor/transferencia-formulario`

Este nuevo endpoint procesa directamente el output del formulario dinámico de transferencia de automotores.

## 🎯 Formato de Entrada

El endpoint acepta el siguiente formato JSON (exactamente como lo genera tu formulario):

```json
{
  "vehiculo": {
    "dominio": "ABC123",
    "codigoAlta": "001",
    "fechaAlta": "2020-01-14",
    "fechaInicio": "2020-01-14",
    "fechaRige": "2020-01-14",
    "origenRnpa": "N",
    "marcaRnpa": "455436",
    "tipoRnpa": "6356356",
    "archivoId": 1
  },
  "transferencia": {
    "tipoTransferencia": "C",
    "montoOperacion": 6784684,
    "moneda": "ARS"
  },
  "vendedor": {
    "cuit": "20-12345678-9",
    "descripcion": "Juan Pérez"
  },
  "comprador": {
    "cuit": "20-11111111-1",
    "descripcion": "Carlos Rodríguez",
    "porcentajePropiedad": 32,
    "tipoVinculo": "PRO",
    "fechaInicioVinculo": "2025-07-03",
    "esResponsable": true
  },
  "documentacion": {
    "documentosPresentados": [
      "dni_comprador",
      "formulario_08",
      "libre_deuda"
    ],
    "situacionEspecial": "EMBARGO",
    "usuarioAlta": "Usuario Sistema",
    "fechaAltaTransferencia": "2025-07-21T17:34:14.009Z"
  }
}
```

## 📤 Formato de Respuesta

### Respuesta Exitosa (200)
```json
{
  "success": true,
  "message": "Transferencia registrada correctamente",
  "data": {
    "transferenciaId": 1,
    "vehiculo": {
      "dominio": "ABC123",
      "archivoId": 1
    },
    "vendedor": {
      "cuit": "20-12345678-9",
      "denominacion": "Juan Pérez",
      "fechaFinVinculo": "2025-07-02T00:00:00.000Z"
    },
    "comprador": {
      "cuit": "20-11111111-1",
      "denominacion": "Carlos Rodríguez",
      "fechaInicioVinculo": "2025-07-03T00:00:00.000Z",
      "porcentajePropiedad": 32,
      "tipoVinculo": "PRO",
      "esResponsable": true
    },
    "transferencia": {
      "tipo": "C",
      "monto": 6784684,
      "moneda": "ARS"
    },
    "documentacion": {
      "documentosPresentados": [
        "dni_comprador",
        "formulario_08",
        "libre_deuda"
      ],
      "situacionEspecial": "EMBARGO",
      "usuarioAlta": "Usuario Sistema",
      "fechaAlta": "2025-07-21T17:34:14.009Z"
    }
  }
}
```

### Respuesta de Error (400)
```json
{
  "success": false,
  "message": "El vendedor con CUIT 20-12345678-9 no es el titular actual del vehículo"
}
```

## 🔍 Validaciones Implementadas

### 1. Validación del Vendedor
- ✅ Verifica que el CUIT del vendedor existe en el sistema
- ✅ Confirma que el vendedor es el titular actual del vehículo

### 2. Validación del Comprador
- ✅ Verifica que el CUIT del comprador existe en el sistema
- ✅ Valida que el porcentaje de propiedad esté entre 1-100

### 3. Validación del Vehículo
- ✅ Confirma que el vehículo existe (por archivoId)
- ✅ Verifica que está disponible para transferencia

### 4. Lógica de Transferencia
- ✅ Cierra el vínculo anterior del vendedor (fecha fin = fecha inicio nueva - 1 día)
- ✅ Crea el nuevo vínculo con el comprador
- ✅ Mantiene la trazabilidad completa de la operación

## 🏗️ Estructura de Clases Creadas

### DTOs Principales

#### `TransferenciaFormularioDto`
DTO principal que contiene todos los datos del formulario

#### `VehiculoTransferenciaDto`
```typescript
{
  dominio: string;
  codigoAlta: string;
  fechaAlta: string;
  fechaInicio: string;
  fechaRige: string;
  origenRnpa: string;
  marcaRnpa: string;
  tipoRnpa: string;
  archivoId: number;
}
```

#### `VendedorDto`
```typescript
{
  cuit: string;
  descripcion: string;
}
```

#### `CompradorDto`
```typescript
{
  cuit: string;
  descripcion: string;
  porcentajePropiedad: number;
  tipoVinculo: string;
  fechaInicioVinculo: string;
  esResponsable: boolean;
}
```

#### `TransferenciaDetalleDto`
```typescript
{
  tipoTransferencia: string;
  montoOperacion?: number;
  moneda?: string;
}
```

#### `DocumentacionDto`
```typescript
{
  documentosPresentados: string[];
  situacionEspecial?: string;
  usuarioAlta: string;
  fechaAltaTransferencia: string;
}
```

## 🔄 Proceso de Transferencia

### 1. Validaciones Previas
```typescript
// Verificar vendedor existe
const vendedorEntity = await this.sujetoPasivoRepository.findByCuit(vendedor.cuit);

// Verificar comprador existe  
const compradorEntity = await this.sujetoPasivoRepository.findByCuit(comprador.cuit);

// Verificar vehículo existe
const ovp = await this.ovpRepository.findById(vehiculo.archivoId);

// Verificar vendedor es titular actual
const titularActual = await this.vinculoRepository.findTitularActual(vehiculo.archivoId);
```

### 2. Cierre de Vínculo Anterior
```typescript
// Calcular fecha de fin (un día antes del nuevo inicio)
const fechaInicio = new Date(comprador.fechaInicioVinculo);
const fechaFinAnterior = new Date(fechaInicio);
fechaFinAnterior.setDate(fechaFinAnterior.getDate() - 1);

// Cerrar vínculo anterior
await this.vinculoRepository.updateFechaHasta(titularActual.id, fechaFinAnterior);
```

### 3. Creación del Nuevo Vínculo
```typescript
const nuevoVinculo = await this.vinculoRepository.create({
  sujetoPasivoId: compradorEntity.id,
  objetoValorPredeterminadoId: vehiculo.archivoId,
  ptvId: comprador.tipoVinculo,
  fechaInicio: fechaInicio,
  fechaFin: null,
  porcentaje: comprador.porcentajePropiedad,
  responsable: comprador.esResponsable ? 'S' : 'N',
  usuarioAlta: documentacion.usuarioAlta,
  fechaAlta: new Date(documentacion.fechaAltaTransferencia),
});
```

## 📋 Diferencias con el Endpoint Anterior

### Endpoint Anterior: `POST /api/automotor/transferencia/:ovpId`
- ❌ Requiere pasar ovpId como parámetro
- ❌ DTO simple con solo 4 campos
- ❌ No incluye datos del vehículo ni documentación
- ❌ Formato de respuesta inconsistente

### Nuevo Endpoint: `POST /api/automotor/transferencia-formulario`
- ✅ Recibe ovpId dentro del JSON (vehiculo.archivoId)
- ✅ DTO completo con todos los datos del formulario
- ✅ Incluye validación completa de todas las entidades
- ✅ Formato de respuesta consistente con `{ success, message, data }`
- ✅ Información detallada en la respuesta
- ✅ Mejor trazabilidad de la operación

## 🚀 Uso desde el Frontend

Para usar este endpoint desde tu frontend, simplemente envía el output del formulario tal como está:

```typescript
// En tu servicio Angular
submitTransferencia(formData: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/automotor/transferencia-formulario`, formData);
}
```

El endpoint procesará automáticamente todos los datos y realizará las validaciones necesarias.

## ✅ Testing Sugerido

### Casos de Prueba
1. **Transferencia válida**: Con todos los datos correctos
2. **Vendedor inexistente**: CUIT que no existe en el sistema
3. **Comprador inexistente**: CUIT que no existe en el sistema
4. **Vendedor no es titular**: CUIT válido pero no es propietario del vehículo
5. **Vehículo inexistente**: archivoId que no existe
6. **Datos inválidos**: Porcentajes fuera de rango, fechas inválidas, etc.

### Comando de Prueba
```bash
curl -X POST http://localhost:3000/api/automotor/transferencia-formulario \
  -H "Content-Type: application/json" \
  -d @transferencia-test.json
```

## 📝 Documentación Swagger

El endpoint está completamente documentado en Swagger con:
- ✅ Descripción detallada de la operación
- ✅ Esquemas de request y response
- ✅ Ejemplos de uso
- ✅ Códigos de error posibles

Accede a la documentación en: `http://localhost:3000/api/docs`
