import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AutomotorService } from '../../application/services/automotor.service';
import { TransferenciaAutomotorDto } from '../dto/transferencia-automotor.dto';
import { TransferenciaFormularioDto } from '../dto/transferencia-formulario.dto';
import { AltaAutomotorDto } from '../dto/alta-automotor.dto';

@ApiTags('automotor')
@Controller('automotor')
export class AutomotorController {
  constructor(private readonly automotorService: AutomotorService) {}

  @Get('consultar/:dominio')
  @ApiOperation({ summary: 'Consultar automotor por dominio' })
  @ApiParam({
    name: 'dominio',
    description: 'Dominio del automotor',
    example: 'ABC123',
  })
  @ApiResponse({
    status: 200,
    description: 'Automotor encontrado',
    schema: {
      type: 'object',
      properties: {
        modelo: { type: 'string', example: 'Gol Trend' },
        codigoAlta: { type: 'number', example: 12345 },
        registroId: { type: 'number', example: 67890 },
        marca: { type: 'string', example: 'Volkswagen' },
        fechaAlta: { type: 'string', format: 'date', example: '2020-01-15' },
        fechaVigencia: {
          type: 'string',
          format: 'date',
          example: '2024-01-01',
        },
        valorVigente: { type: 'number', example: 1500000.0 },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Automotor no encontrado' })
  async consultarPorDominio(@Param('dominio') dominio: string) {
    return this.automotorService.consultarPorDominio(dominio);
  }

  @Get('titular/:ovpId')
  @ApiOperation({ summary: 'Obtener titular actual del automotor' })
  @ApiParam({
    name: 'ovpId',
    description: 'ID del objeto valor predeterminado',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Titular actual encontrado',
    schema: {
      type: 'object',
      properties: {
        cuit: { type: 'string', example: '20-12345678-9' },
        razonSocial: { type: 'string', example: 'Juan Pérez' },
        porcentaje: { type: 'number', example: 100.0 },
        responsable: { type: 'string', example: 'Sí' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Titular no encontrado' })
  async obtenerTitularActual(@Param('ovpId', ParseIntPipe) ovpId: number) {
    return this.automotorService.obtenerTitularActual(ovpId);
  }

  @Post('transferencia/:ovpId')
  @ApiOperation({ summary: 'Registrar transferencia de automotor' })
  @ApiParam({
    name: 'ovpId',
    description: 'ID del objeto valor predeterminado',
    example: 1,
  })
  @ApiResponse({
    status: 201,
    description: 'Transferencia registrada exitosamente',
    schema: {
      type: 'object',
      properties: {
        mensaje: {
          type: 'string',
          example: 'Transferencia registrada correctamente.',
        },
        transferencia: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            nuevoTitular: {
              type: 'object',
              properties: {
                cuit: { type: 'string', example: '20-12345678-9' },
                razonSocial: { type: 'string', example: 'María González' },
              },
            },
            fechaInicio: {
              type: 'string',
              format: 'date',
              example: '2024-01-15',
            },
            porcentaje: { type: 'number', example: 100.0 },
            responsable: { type: 'string', example: 'Sí' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos de transferencia inválidos' })
  @ApiResponse({
    status: 404,
    description: 'Automotor o titular no encontrado',
  })
  async registrarTransferencia(
    @Param('ovpId', ParseIntPipe) ovpId: number,
    @Body() transferenciaDto: TransferenciaAutomotorDto,
  ) {
    return this.automotorService.registrarTransferencia(
      ovpId,
      transferenciaDto,
    );
  }

  @Post('transferencia-formulario')
  @ApiOperation({
    summary: 'Registrar transferencia usando datos del formulario dinámico',
    description:
      'Endpoint que procesa el output completo del formulario de transferencia',
  })
  @ApiResponse({
    status: 201,
    description: 'Transferencia registrada exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Transferencia registrada correctamente',
        },
        data: {
          type: 'object',
          properties: {
            transferenciaId: { type: 'number', example: 1 },
            vehiculo: {
              type: 'object',
              properties: {
                dominio: { type: 'string', example: 'ABC123' },
                archivoId: { type: 'number', example: 1 },
              },
            },
            vendedor: {
              type: 'object',
              properties: {
                cuit: { type: 'string', example: '20-12345678-9' },
                denominacion: { type: 'string', example: 'Juan Pérez' },
                fechaFinVinculo: { type: 'string', format: 'date-time' },
              },
            },
            comprador: {
              type: 'object',
              properties: {
                cuit: { type: 'string', example: '20-11111111-1' },
                denominacion: { type: 'string', example: 'Carlos Rodríguez' },
                fechaInicioVinculo: { type: 'string', format: 'date-time' },
                porcentajePropiedad: { type: 'number', example: 32 },
                tipoVinculo: { type: 'string', example: 'PRO' },
                esResponsable: { type: 'boolean', example: true },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error en los datos de transferencia',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example: 'Error al registrar transferencia',
        },
      },
    },
  })
  async registrarTransferenciaFormulario(
    @Body() transferenciaFormularioDto: TransferenciaFormularioDto,
  ) {
    return this.automotorService.registrarTransferenciaFormulario(
      transferenciaFormularioDto,
    );
  }

  @Post('alta')
  @ApiOperation({ summary: 'Registrar alta de nuevo automotor' })
  @ApiResponse({
    status: 201,
    description: 'Automotor registrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        mensaje: {
          type: 'string',
          example: 'Automotor registrado correctamente.',
        },
        automotor: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            patente: { type: 'string', example: 'AA123BB' },
            propietario: {
              type: 'object',
              properties: {
                cuit: { type: 'string', example: '20-12345678-9' },
                razonSocial: { type: 'string', example: 'Juan Pérez' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos de alta inválidos' })
  async registrarAlta(@Body() altaDto: AltaAutomotorDto) {
    return this.automotorService.registrarAlta(altaDto);
  }
}
