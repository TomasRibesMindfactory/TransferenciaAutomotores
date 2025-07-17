import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AutomotorService } from '../../application/services/automotor.service';
import { ConsultarAutomotorDto } from '../dto/consultar-automotor.dto';
import { TransferenciaAutomotorDto } from '../dto/transferencia-automotor.dto';

@ApiTags('automotor')
@Controller('automotor')
export class AutomotorController {
  constructor(private readonly automotorService: AutomotorService) {}

  @Get('consultar/:dominio')
  @ApiOperation({ summary: 'Consultar automotor por dominio' })
  @ApiParam({ name: 'dominio', description: 'Dominio del automotor', example: 'ABC123' })
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
        fechaVigencia: { type: 'string', format: 'date', example: '2024-01-01' },
        valorVigente: { type: 'number', example: 1500000.00 },
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Automotor no encontrado' })
  async consultarPorDominio(@Param('dominio') dominio: string) {
    return this.automotorService.consultarPorDominio(dominio);
  }

  @Get('titular/:ovpId')
  @ApiOperation({ summary: 'Obtener titular actual del automotor' })
  @ApiParam({ name: 'ovpId', description: 'ID del objeto valor predeterminado', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Titular actual encontrado',
    schema: {
      type: 'object',
      properties: {
        cuit: { type: 'string', example: '20-12345678-9' },
        razonSocial: { type: 'string', example: 'Juan Pérez' },
        porcentaje: { type: 'number', example: 100.00 },
        responsable: { type: 'string', example: 'Sí' },
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Titular no encontrado' })
  async obtenerTitularActual(@Param('ovpId', ParseIntPipe) ovpId: number) {
    return this.automotorService.obtenerTitularActual(ovpId);
  }

  @Post('transferencia/:ovpId')
  @ApiOperation({ summary: 'Registrar transferencia de automotor' })
  @ApiParam({ name: 'ovpId', description: 'ID del objeto valor predeterminado', example: 1 })
  @ApiResponse({ 
    status: 201, 
    description: 'Transferencia registrada exitosamente',
    schema: {
      type: 'object',
      properties: {
        mensaje: { type: 'string', example: 'Transferencia registrada correctamente.' },
        transferencia: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            nuevoTitular: {
              type: 'object',
              properties: {
                cuit: { type: 'string', example: '20-12345678-9' },
                razonSocial: { type: 'string', example: 'María González' },
              }
            },
            fechaInicio: { type: 'string', format: 'date', example: '2024-01-15' },
            porcentaje: { type: 'number', example: 100.00 },
            responsable: { type: 'string', example: 'Sí' },
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de transferencia inválidos' })
  @ApiResponse({ status: 404, description: 'Automotor o titular no encontrado' })
  async registrarTransferencia(
    @Param('ovpId', ParseIntPipe) ovpId: number,
    @Body() transferenciaDto: TransferenciaAutomotorDto,
  ) {
    return this.automotorService.registrarTransferencia(ovpId, transferenciaDto);
  }
} 