import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ValidationsService } from '../../application/services/validations.service';

@ApiTags('forms')
@Controller('forms')
export class FormsValidationController {
  constructor(private readonly validationsService: ValidationsService) {}

  @Get('vehicle-transfer/validate')
  @ApiOperation({
    summary:
      'Validación para formulario dinámico de transferencia de vehículos',
    description:
      'Endpoint unificado para todas las validaciones del formulario vehicle-transfer',
  })
  @ApiQuery({
    name: 'field',
    description: 'Campo a validar',
    enum: [
      'dominio',
      'cuit',
      'codigo_alta',
      'registro_automotor',
      'tipo_vehiculo',
      'modelo_rnpa',
      'moneda',
    ],
    required: true,
  })
  @ApiQuery({
    name: 'value',
    description: 'Valor a validar',
    required: true,
  })
  @ApiQuery({
    name: 'ptaId',
    description: 'ID del tipo de alta (solo para codigo_alta)',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Validación exitosa',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean' },
        data: { type: 'object' },
        fields: {
          type: 'object',
          description: 'Campos que se auto-rellenan según la validación',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros inválidos o validación fallida',
  })
  async validateField(
    @Query('field') field: string,
    @Query('value') value: string,
    @Query('ptaId') ptaId?: string,
  ) {
    if (!field || !value) {
      throw new BadRequestException(
        'Los parámetros field y value son requeridos',
      );
    }

    let result: any;
    let autoFillFields: any = {};

    switch (field) {
      case 'dominio':
        result = await this.validationsService.validateDominio(value);
        if (result.isValid && result.data) {
          // Mapear todos los campos que se auto-rellenan con el dominio
          autoFillFields = {
            // Campos del automotor
            tipo_vehiculo: result.data.atrPthId,
            modelo_rnpa: result.data.atrPmoId,
            codigo_alta: result.data.atrPcaId,
            registro_automotor: result.data.atrPrtId,
            fecha_alta: result.data.atrFechaAlta,
            fecha_inicio: result.data.atrFechaInicio,
            fecha_fabricacion: result.data.atrFechaFabricacion,
            fecha_rige: result.data.atrFechaRige,
            usuario_alta: result.data.atrUsuarioAlta,
            fecha_ultima_actualizacion: result.data.atrFechaUltimaActualizacion,
            id_marca_rnpa: result.data.atrIdMarcaRnpa,
            id_tipo_rnpa: result.data.atrIdTipoRnpa,
            id_modelo_rnpa: result.data.atrIdModeloRnpa,
            origen_rnpa: result.data.atrOrigenRnpa,

            // Descripciones auto-rellenadas
            descripcion_marca: result.data.lDescripcionMarca,
            descripcion_tipo: result.data.lDescripcionTipo,
            descripcion_modelo: result.data.lDescripcionModelo,
            descripcion_modelo_rnpa: result.data.lPmoPmoDescripcion,
            descripcion_codigo_alta: result.data.lPcaPcaDescripcion,
            descripcion_registro: result.data.lPrtPrtDescripcion,
            municipio_descripcion: result.data.municipioDesc,

            // ID del objeto valor predeterminado (importante para transferencias)
            ovp_id: result.data.ovpId,
          };
        }
        break;

      case 'cuit':
        result = await this.validationsService.validateCuit(value);
        if (result.isValid && result.data) {
          autoFillFields = {
            propietario_id: result.data.spoId,
            propietario_descripcion: result.data.spoDenominacion,
            fecha_baja: result.data.spoFechaBaja,
          };
        }
        break;

      case 'codigo_alta':
        result = await this.validationsService.validateCodigoAlta(value, ptaId);
        if (result.isValid && result.data) {
          autoFillFields = {
            descripcion_codigo_alta: result.data.descripcion,
          };
        }
        break;

      case 'registro_automotor':
        result = await this.validationsService.validateRegistroAutomotor(value);
        if (result.isValid && result.data) {
          autoFillFields = {
            descripcion_registro: result.data.descripcion,
          };
        }
        break;

      case 'tipo_vehiculo':
        result = await this.validationsService.validateTipoVehiculo(value);
        if (result.isValid && result.data) {
          autoFillFields = {
            descripcion_tipo: result.data.descripcion,
          };
        }
        break;

      case 'modelo_rnpa':
        result = await this.validationsService.validateModeloRnpa(value);
        if (result.isValid && result.data) {
          autoFillFields = {
            descripcion_modelo_rnpa: result.data.descripcion,
          };
        }
        break;

      case 'moneda':
        result = await this.validationsService.validateMoneda(value);
        if (result.isValid && result.data) {
          autoFillFields = {
            descripcion_moneda: result.data.descripcion,
          };
        }
        break;

      default:
        throw new BadRequestException(
          `Campo de validación no soportado: ${field}`,
        );
    }

    return {
      isValid: result.isValid,
      data: result.data,
      error: result.error,
      fields: autoFillFields,
    };
  }

  @Get('vehicle-transfer/lookup')
  @ApiOperation({
    summary: 'Búsqueda para campos de lookup en formulario de transferencia',
    description:
      'Endpoint para búsquedas y autocompletado en campos específicos',
  })
  @ApiQuery({
    name: 'field',
    description: 'Campo para el cual buscar opciones',
    enum: [
      'tipo_vehiculo',
      'modelo_rnpa',
      'codigo_alta',
      'registro_automotor',
      'moneda',
    ],
    required: true,
  })
  @ApiQuery({
    name: 'search',
    description: 'Término de búsqueda (opcional)',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Límite de resultados (default: 10)',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de opciones encontradas',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: { type: 'string', description: 'Valor del campo' },
          label: { type: 'string', description: 'Texto a mostrar' },
          description: { type: 'string', description: 'Descripción adicional' },
        },
      },
    },
  })
  async lookupOptions(
    @Query('field') field: string,
    @Query('search') search?: string,
    @Query('limit') limit = '10',
  ) {
    if (!field) {
      throw new BadRequestException('El parámetro field es requerido');
    }

    const limitNumber = Math.min(parseInt(limit, 10) || 10, 100); // Máximo 100 resultados

    // TODO: Implementar búsquedas en las tablas paramétricas
    // Por ahora retornamos datos de ejemplo
    const mockData: { [key: string]: any[] } = {
      tipo_vehiculo: [
        {
          value: 'AUTO',
          label: 'Automóvil',
          description: 'Vehículo de uso particular',
        },
        {
          value: 'MOTO',
          label: 'Motocicleta',
          description: 'Vehículo de dos ruedas',
        },
        { value: 'CAMION', label: 'Camión', description: 'Vehículo de carga' },
      ],
      modelo_rnpa: [
        {
          value: 'GOL',
          label: 'Gol Trend',
          description: 'Volkswagen Gol Trend',
        },
        {
          value: 'CORSA',
          label: 'Corsa Classic',
          description: 'Chevrolet Corsa Classic',
        },
        { value: 'FOCUS', label: 'Focus', description: 'Ford Focus' },
      ],
      codigo_alta: [
        {
          value: '001',
          label: 'Primera Inscripción',
          description: 'Primer alta del vehículo',
        },
        {
          value: '002',
          label: 'Transferencia',
          description: 'Cambio de titularidad',
        },
        {
          value: '003',
          label: 'Duplicado',
          description: 'Duplicado de documentación',
        },
      ],
      registro_automotor: [
        {
          value: 'RA001',
          label: 'Registro Córdoba',
          description: 'Registro Automotor Córdoba Capital',
        },
        {
          value: 'RA002',
          label: 'Registro Villa María',
          description: 'Registro Automotor Villa María',
        },
        {
          value: 'RA003',
          label: 'Registro Río Cuarto',
          description: 'Registro Automotor Río Cuarto',
        },
      ],
      moneda: [
        {
          value: 'ARS',
          label: 'Peso Argentino',
          description: 'Moneda nacional argentina',
        },
        {
          value: 'USD',
          label: 'Dólar Estadounidense',
          description: 'Dólar de Estados Unidos',
        },
        { value: 'EUR', label: 'Euro', description: 'Moneda europea' },
      ],
    };

    let results = mockData[field] || [];

    // Filtrar por término de búsqueda si se proporciona
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        (item) =>
          item.label.toLowerCase().includes(searchLower) ||
          item.value.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower),
      );
    }

    // Aplicar límite
    return results.slice(0, limitNumber);
  }
}
