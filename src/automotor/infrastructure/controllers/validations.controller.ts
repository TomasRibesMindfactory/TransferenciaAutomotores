import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ValidationsService } from '../../application/services/validations.service';

@ApiTags('validations')
@Controller('validations')
export class ValidationsController {
  constructor(private readonly validationsService: ValidationsService) {}

  @Get('dominio')
  @ApiOperation({
    summary: 'Validar dominio y obtener datos completos del automotor',
    description:
      'Valida un dominio de automotor y retorna todos los datos asociados, equivalente a VERIFICAR_DOMINIO + EXECUTE_QUERY en Oracle Forms',
  })
  @ApiQuery({
    name: 'value',
    description: 'Dominio del automotor a validar',
    example: 'AA123BB',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Validación exitosa',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Dominio válido' },
        data: {
          type: 'object',
          properties: {
            atrId: { type: 'number', example: 1 },
            atrDominio: { type: 'string', example: 'AA123BB' },
            atrPthId: { type: 'string', example: 'AUTO' },
            atrPmoId: { type: 'string', example: 'GOL' },
            atrPcaId: { type: 'string', example: '001' },
            atrPrtId: { type: 'string', example: 'RA001' },
            atrFechaAlta: { type: 'string', format: 'date-time' },
            atrFechaInicio: { type: 'string', format: 'date-time' },
            atrFechaFabricacion: { type: 'string', format: 'date-time' },
            atrFechaRige: { type: 'string', format: 'date-time' },
            atrUsuarioAlta: { type: 'string', example: 'admin' },
            atrFechaUltimaActualizacion: {
              type: 'string',
              format: 'date-time',
            },
            atrIdMarcaRnpa: { type: 'string', example: 'VW' },
            atrIdTipoRnpa: { type: 'string', example: 'SED' },
            atrIdModeloRnpa: { type: 'string', example: 'GOL' },
            atrOrigenRnpa: { type: 'string', example: 'NAC' },
            marcaDescripcion: { type: 'string', example: 'Volkswagen' },
            tipoDescripcion: { type: 'string', example: 'Automóvil' },
            modeloDescripcion: { type: 'string', example: 'Gol Trend' },
            pmoDescripcion: { type: 'string', example: 'Gol Trend' },
            pcaDescripcion: {
              type: 'string',
              example: 'Primera Inscripción',
            },
            prtDescripcion: { type: 'string', example: 'Registro Córdoba' },
            municipioDesc: { type: 'string', example: 'Córdoba Capital' },
            ovpId: { type: 'number', example: 1 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dominio no válido o no encontrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example: 'Dominio AA123BB no encontrado o no está activo',
        },
      },
    },
  })
  async validateDominio(@Query('value') dominio: string) {
    if (!dominio) {
      throw new BadRequestException('El dominio es requerido');
    }

    return this.validationsService.validateDominio(dominio);
  }

  @Get('cuit')
  @ApiOperation({
    summary: 'Validar CUIT y obtener datos del sujeto pasivo',
    description:
      'Valida un CUIT y retorna los datos del sujeto pasivo, equivalente a obtiene_cuit en Oracle Forms',
  })
  @ApiQuery({
    name: 'value',
    description: 'CUIT del sujeto pasivo a validar',
    example: '20-12345678-9',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Validación exitosa',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'CUIT válido' },
        data: {
          type: 'object',
          properties: {
            spoId: { type: 'number', example: 1 },
            spoDenominacion: { type: 'string', example: 'Juan Pérez' },
            spoFechaBaja: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'CUIT no válido o no encontrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example: 'CUIT 20-12345678-9 no encontrado',
        },
      },
    },
  })
  async validateCuit(@Query('value') cuit: string) {
    if (!cuit) {
      throw new BadRequestException('El CUIT es requerido');
    }

    return this.validationsService.validateCuit(cuit);
  }

  @Get('codigo-alta')
  @ApiOperation({
    summary: 'Validar código de alta y obtener descripción',
    description:
      'Valida un código de alta y retorna su descripción, equivalente a CGFK$CHK_AUTOMOTORES_ATR_PCA_F en Oracle Forms',
  })
  @ApiQuery({
    name: 'value',
    description: 'Código de alta a validar',
    example: '001',
    required: true,
  })
  @ApiQuery({
    name: 'ptaId',
    description: 'ID del tipo de alta (opcional)',
    example: 'PI',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Validación exitosa',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            descripcion: { type: 'string', example: 'Primera Inscripción' },
          },
        },
      },
    },
  })
  async validateCodigoAlta(
    @Query('value') pcaId: string,
    @Query('ptaId') ptaId?: string,
  ) {
    if (!pcaId) {
      throw new BadRequestException('El código de alta es requerido');
    }

    return this.validationsService.validateCodigoAlta(pcaId, ptaId);
  }

  @Get('registro-automotor')
  @ApiOperation({
    summary: 'Validar registro automotor y obtener descripción',
    description:
      'Valida un registro automotor y retorna su descripción, equivalente a CGFK$QRY_AUTOMOTORES_ATR_PRT_F en Oracle Forms',
  })
  @ApiQuery({
    name: 'value',
    description: 'ID del registro automotor a validar',
    example: 'RA001',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Validación exitosa',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            descripcion: { type: 'string', example: 'Registro Córdoba' },
          },
        },
      },
    },
  })
  async validateRegistroAutomotor(@Query('value') prtId: string) {
    if (!prtId) {
      throw new BadRequestException(
        'El ID del registro automotor es requerido',
      );
    }

    return this.validationsService.validateRegistroAutomotor(prtId);
  }

  @Get('tipo-vehiculo')
  @ApiOperation({
    summary: 'Validar tipo de vehículo y obtener descripción',
    description:
      'Valida un tipo de vehículo y retorna su descripción, equivalente a CGFK$CHK_AUTOMOTORES_ATR_PTH_F en Oracle Forms',
  })
  @ApiQuery({
    name: 'value',
    description: 'ID del tipo de vehículo a validar',
    example: 'AUTO',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Validación exitosa',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            descripcion: { type: 'string', example: 'Automóvil' },
          },
        },
      },
    },
  })
  async validateTipoVehiculo(@Query('value') pthId: string) {
    if (!pthId) {
      throw new BadRequestException('El ID del tipo de vehículo es requerido');
    }

    return this.validationsService.validateTipoVehiculo(pthId);
  }

  @Get('modelo-rnpa')
  @ApiOperation({
    summary: 'Validar modelo RNPA y obtener descripción',
    description:
      'Valida un modelo RNPA y retorna su descripción, equivalente a CGFK$QRY_AUTOMOTORES_ATR_PMO_F en Oracle Forms',
  })
  @ApiQuery({
    name: 'value',
    description: 'ID del modelo RNPA a validar',
    example: 'GOL',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Validación exitosa',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            descripcion: { type: 'string', example: 'Gol Trend' },
          },
        },
      },
    },
  })
  async validateModeloRnpa(@Query('value') pmoId: string) {
    if (!pmoId) {
      throw new BadRequestException('El ID del modelo RNPA es requerido');
    }

    return this.validationsService.validateModeloRnpa(pmoId);
  }

  @Get('moneda')
  @ApiOperation({
    summary: 'Validar moneda y obtener descripción',
    description:
      'Valida una moneda y retorna su descripción, equivalente a CGFK$CHK_TRANSFERENCIAS_TFA_PM en Oracle Forms',
  })
  @ApiQuery({
    name: 'value',
    description: 'ID de la moneda a validar',
    example: 'ARS',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Validación exitosa',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            descripcion: { type: 'string', example: 'Peso Argentino' },
          },
        },
      },
    },
  })
  async validateMoneda(@Query('value') pmaId: string) {
    if (!pmaId) {
      throw new BadRequestException('El ID de la moneda es requerido');
    }

    return this.validationsService.validateMoneda(pmaId);
  }
}
