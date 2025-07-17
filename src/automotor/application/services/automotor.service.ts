import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AutomotorRepositoryPort } from '../../domain/ports/automotor-repository.port';
import { SujetoPasivoRepositoryPort } from '../../domain/ports/sujeto-pasivo-repository.port';
import { VinculoSujetoObjetoRepositoryPort } from '../../domain/ports/vinculo-sujeto-objeto-repository.port';
import { ObjetoValorPredeterminadoRepositoryPort } from '../../domain/ports/objeto-valor-predeterminado-repository.port';
import { TransferenciaAutomotorDto } from '../../infrastructure/dto/transferencia-automotor.dto';

@Injectable()
export class AutomotorService {
  constructor(
    private readonly automotorRepository: AutomotorRepositoryPort,
    private readonly sujetoPasivoRepository: SujetoPasivoRepositoryPort,
    private readonly vinculoRepository: VinculoSujetoObjetoRepositoryPort,
    private readonly ovpRepository: ObjetoValorPredeterminadoRepositoryPort,
  ) {}

  /**
   * Consulta un automotor por dominio
   */
  async consultarPorDominio(dominio: string) {
    const automotor = await this.automotorRepository.findByDominio(dominio);
    
    if (!automotor) {
      throw new NotFoundException(`Automotor con dominio ${dominio} no encontrado`);
    }

    const objetosValor = await this.ovpRepository.findByAutomotorId(automotor.id);
    const objetoVigente = objetosValor[0]; // El más reciente

    return {
      modelo: automotor.modelo,
      codigoAlta: automotor.codigoAlta,
      registroId: automotor.registroId,
      marca: automotor.marca,
      fechaAlta: automotor.fechaAlta,
      fechaVigencia: objetoVigente?.fechaVigencia || null,
      valorVigente: objetoVigente?.valor || null,
    };
  }

  /**
   * Obtiene el titular actual de un automotor
   */
  async obtenerTitularActual(ovpId: number) {
    const vinculo = await this.vinculoRepository.findTitularActual(ovpId);
    
    if (!vinculo) {
      throw new NotFoundException(`No se encontró titular actual para el automotor`);
    }

    return {
      cuit: vinculo.sujetoPasivo.cuit,
      razonSocial: vinculo.sujetoPasivo.razonSocial,
      porcentaje: vinculo.porcentaje,
      responsable: vinculo.responsable === 'S' ? 'Sí' : 'No',
    };
  }

  /**
   * Registra una transferencia de automotor
   */
  async registrarTransferencia(ovpId: number, transferenciaDto: TransferenciaAutomotorDto) {
    // Validar que el nuevo titular existe
    const nuevoTitular = await this.sujetoPasivoRepository.findByCuit(transferenciaDto.cuit);
    if (!nuevoTitular) {
      throw new BadRequestException(`El CUIT ${transferenciaDto.cuit} no existe en el sistema`);
    }

    // Validar que el objeto valor predeterminado existe
    const ovp = await this.ovpRepository.findById(ovpId);
    if (!ovp) {
      throw new NotFoundException(`Objeto valor predeterminado con ID ${ovpId} no encontrado`);
    }

    // Obtener el titular actual para cerrar su vínculo
    const titularActual = await this.vinculoRepository.findTitularActual(ovpId);
    
    // Calcular fecha de fin del vínculo anterior (un día antes de la nueva fecha de inicio)
    const fechaInicio = new Date(transferenciaDto.fechaInicio);
    const fechaFinAnterior = new Date(fechaInicio);
    fechaFinAnterior.setDate(fechaFinAnterior.getDate() - 1);

    // Cerrar el vínculo anterior si existe
    if (titularActual) {
      await this.vinculoRepository.updateFechaHasta(titularActual.id, fechaFinAnterior);
    }

    // Crear el nuevo vínculo
    const nuevoVinculo = await this.vinculoRepository.create({
      sujetoPasivoId: nuevoTitular.id,
      objetoValorPredeterminadoId: ovpId,
      fechaInicio: fechaInicio,
      fechaHasta: null,
      fechaBaja: null,
      porcentaje: transferenciaDto.porcentaje,
      responsable: transferenciaDto.responsable ? 'S' : 'N',
    });

    return {
      mensaje: 'Transferencia registrada correctamente.',
      transferencia: {
        id: nuevoVinculo.id,
        nuevoTitular: {
          cuit: nuevoTitular.cuit,
          razonSocial: nuevoTitular.razonSocial,
        },
        fechaInicio: nuevoVinculo.fechaInicio,
        porcentaje: nuevoVinculo.porcentaje,
        responsable: nuevoVinculo.responsable === 'S' ? 'Sí' : 'No',
      },
    };
  }
} 