import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TransferenciaService } from '../../application/services/transferencia.service';
import {
  CrearTransferenciaDto,
  ConsultarTransferenciaDto,
} from '../dto/transferencia.dto';

@Controller('transferencias')
export class TransferenciaController {
  constructor(private readonly transferenciaService: TransferenciaService) {}

  @Post()
  async crearTransferencia(@Body() dto: CrearTransferenciaDto) {
    return await this.transferenciaService.crearTransferencia({
      ...dto,
      fechaTransferencia: new Date(dto.fechaTransferencia),
    });
  }

  @Get(':id')
  async obtenerTransferenciaPorId(@Param('id', ParseIntPipe) id: number) {
    return await this.transferenciaService.obtenerTransferenciaPorId(id);
  }

  @Get()
  async consultarTransferencias(@Query() query: ConsultarTransferenciaDto) {
    if (query.dominio) {
      return await this.transferenciaService.obtenerTransferenciasPorDominio(
        query.dominio,
      );
    }

    if (query.sujetoPasivoId) {
      return await this.transferenciaService.obtenerTransferenciasPorSujetoPasivo(
        query.sujetoPasivoId,
      );
    }

    return await this.transferenciaService.obtenerTodasLasTransferencias();
  }
}
