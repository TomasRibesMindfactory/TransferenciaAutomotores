import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { AutomotorRepositoryPort } from '../../domain/ports/automotor-repository.port';
import { SujetoPasivoRepositoryPort } from '../../domain/ports/sujeto-pasivo-repository.port';
import { VinculoSujetoObjetoRepositoryPort } from '../../domain/ports/vinculo-sujeto-objeto-repository.port';
import { ObjetoValorPredeterminadoRepositoryPort } from '../../domain/ports/objeto-valor-predeterminado-repository.port';
import { TransferenciaAutomotorDto } from '../../infrastructure/dto/transferencia-automotor.dto';
import { AltaAutomotorDto } from '../../infrastructure/dto/alta-automotor.dto';

@Injectable()
export class AutomotorService {
  constructor(
    @Inject('AutomotorRepositoryPort')
    private readonly automotorRepository: AutomotorRepositoryPort,
    @Inject('SujetoPasivoRepositoryPort')
    private readonly sujetoPasivoRepository: SujetoPasivoRepositoryPort,
    @Inject('VinculoSujetoObjetoRepositoryPort')
    private readonly vinculoRepository: VinculoSujetoObjetoRepositoryPort,
    @Inject('ObjetoValorPredeterminadoRepositoryPort')
    private readonly ovpRepository: ObjetoValorPredeterminadoRepositoryPort,
  ) {}

  /**
   * Consulta un automotor por dominio
   */
  async consultarPorDominio(dominio: string) {
    const automotor = await this.automotorRepository.findByDominio(dominio);

    if (!automotor) {
      throw new NotFoundException(
        `Automotor con dominio ${dominio} no encontrado`,
      );
    }

    const objetosValor = await this.ovpRepository.findByAutomotorId(
      automotor.id,
    );
    const objetoVigente = objetosValor[0]; // El más reciente

    return {
      dominio: automotor.dominio,
      fechaInicio: automotor.fechaInicio,
      fechaFabricacion: automotor.fechaFabricacion,
      pthId: automotor.pthId,
      fechaAlta: automotor.fechaAlta,
      numeroChasis: automotor.numeroChasis || null,
      numeroMotor: automotor.numeroMotor || null,
      color: automotor.color || null,
    };
  }

  /**
   * Obtiene el titular actual de un automotor
   */
  async obtenerTitularActual(ovpId: number) {
    const vinculo = await this.vinculoRepository.findTitularActual(ovpId);

    if (!vinculo) {
      throw new NotFoundException(
        `No se encontró titular actual para el automotor`,
      );
    }

    return {
      cuit: vinculo.sujetoPasivo.cuit,
      denominacion: vinculo.sujetoPasivo.denominacion,
      porcentaje: vinculo.porcentaje,
      responsable: vinculo.responsable === 'S' ? 'Sí' : 'No',
    };
  }

  /**
   * Registra una transferencia de automotor
   */
  async registrarTransferencia(
    ovpId: number,
    transferenciaDto: TransferenciaAutomotorDto,
  ) {
    // Validar que el nuevo titular existe
    const nuevoTitular = await this.sujetoPasivoRepository.findByCuit(
      transferenciaDto.cuit,
    );
    if (!nuevoTitular) {
      throw new BadRequestException(
        `El CUIT ${transferenciaDto.cuit} no existe en el sistema`,
      );
    }

    // Validar que el objeto valor predeterminado existe
    const ovp = await this.ovpRepository.findById(ovpId);
    if (!ovp) {
      throw new NotFoundException(
        `Objeto valor predeterminado con ID ${ovpId} no encontrado`,
      );
    }

    // Obtener el titular actual para cerrar su vínculo
    const titularActual = await this.vinculoRepository.findTitularActual(ovpId);

    // Calcular fecha de fin del vínculo anterior (un día antes de la nueva fecha de inicio)
    const fechaInicio = new Date(transferenciaDto.fechaInicio);
    const fechaFinAnterior = new Date(fechaInicio);
    fechaFinAnterior.setDate(fechaFinAnterior.getDate() - 1);

    // Cerrar el vínculo anterior si existe
    if (titularActual) {
      await this.vinculoRepository.updateFechaHasta(
        titularActual.id,
        fechaFinAnterior,
      );
    }

    // Crear el nuevo vínculo
    const nuevoVinculo = await this.vinculoRepository.create({
      sujetoPasivoId: nuevoTitular.id,
      objetoValorPredeterminadoId: ovpId,
      ptvId: 'PROP', // Tipo de vínculo por defecto
      fechaInicio: fechaInicio,
      fechaFin: null,
      fechaBaja: null,
      porcentaje: transferenciaDto.porcentaje,
      responsable: transferenciaDto.responsable ? 'S' : 'N',
      usuarioAlta: 'SYSTEM',
      fechaAlta: new Date(),
    });

    return {
      mensaje: 'Transferencia registrada correctamente.',
      transferencia: {
        id: nuevoVinculo.id,
        nuevoTitular: {
          cuit: nuevoTitular.cuit,
          denominacion: nuevoTitular.denominacion,
        },
        fechaInicio: nuevoVinculo.fechaInicio,
        porcentaje: nuevoVinculo.porcentaje,
        responsable: nuevoVinculo.responsable === 'S' ? 'Sí' : 'No',
      },
    };
  }

  /**
   * Registra un alta de automotor (nuevo vehículo)
   */
  async registrarAlta(altaDto: AltaAutomotorDto) {
    try {
      // Buscar el propietario inicial
      const propietario = await this.sujetoPasivoRepository.findByCuit(
        altaDto.propietario.cuit,
      );

      if (!propietario) {
        throw new NotFoundException(
          `Propietario con CUIT ${altaDto.propietario.cuit} no encontrado`,
        );
      }

      // Crear el automotor si no existe
      let automotor = await this.automotorRepository.findByDominio(
        altaDto.ovpId,
      );

      if (!automotor) {
        // Crear nuevo automotor
        automotor = await this.automotorRepository.create({
          dominio: altaDto.ovpId,
          fechaInicio: new Date(),
          fechaFabricacion: new Date().getFullYear(),
          fechaRige: new Date(),
          pcaPtaId: '001',
          pcaId: '001',
          pthId: 'AUTO',
          usuarioAlta: 'SYSTEM',
          fechaAlta: new Date(),
        });
      }

      // Crear el objeto valor predeterminado
      const objetoValor = await this.ovpRepository.create({
        atrId: automotor.id,
        fechaInicio: new Date(),
        tipo: 'A',
        atrDominio: automotor.dominio,
        atrPthId: automotor.pthId,
        usuarioAlta: 'SYSTEM',
        fechaAlta: new Date(),
      });

      // Crear vínculo inicial con el propietario
      const vinculoInicial = await this.vinculoRepository.create({
        sujetoPasivoId: propietario.id,
        objetoValorPredeterminadoId: objetoValor.id,
        ptvId: 'PROP',
        fechaInicio: new Date(),
        fechaFin: null,
        porcentaje: altaDto.propietario.porcentajePropiedad || 100,
        responsable: altaDto.propietario.esResponsable ? 'S' : 'N',
        usuarioAlta: 'SYSTEM',
        fechaAlta: new Date(),
      });

      return {
        mensaje: 'Automotor registrado correctamente.',
        automotor: {
          id: automotor.id,
          patente: automotor.dominio,
          propietario: {
            cuit: propietario.cuit,
            denominacion: propietario.denominacion,
          },
          fechaAlta: automotor.fechaAlta,
          porcentaje: vinculoInicial.porcentaje,
          responsable: vinculoInicial.responsable === 'S' ? 'Sí' : 'No',
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Error al registrar alta de automotor: ${error.message}`,
      );
    }
  }
}
