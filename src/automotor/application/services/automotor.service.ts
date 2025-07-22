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
import { TransferenciaFormularioDto } from '../../infrastructure/dto/transferencia-formulario.dto';
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
   * Registra una transferencia de automotor usando datos del formulario
   */
  async registrarTransferenciaFormulario(
    transferenciaFormularioDto: TransferenciaFormularioDto,
  ) {
    const { vehiculo, vendedor, comprador, transferencia, documentacion } =
      transferenciaFormularioDto;

    try {
      // Validar que el vendedor existe
      const vendedorEntity = await this.sujetoPasivoRepository.findByCuit(
        vendedor.cuit,
      );
      if (!vendedorEntity) {
        throw new BadRequestException(
          `El vendedor con CUIT ${vendedor.cuit} no existe en el sistema`,
        );
      }

      // Validar que el comprador existe
      const compradorEntity = await this.sujetoPasivoRepository.findByCuit(
        comprador.cuit,
      );
      if (!compradorEntity) {
        throw new BadRequestException(
          `El comprador con CUIT ${comprador.cuit} no existe en el sistema`,
        );
      }

      // Buscar el objeto valor predeterminado por el archivoId
      const ovp = await this.ovpRepository.findById(vehiculo.archivoId);
      if (!ovp) {
        throw new NotFoundException(
          `Vehículo con ID ${vehiculo.archivoId} no encontrado`,
        );
      }

      // Validar que el vendedor es el titular actual
      const titularActual = await this.vinculoRepository.findTitularActual(
        vehiculo.archivoId,
      );
      if (!titularActual || titularActual.sujetoPasivo.cuit !== vendedor.cuit) {
        throw new BadRequestException(
          `El vendedor ${vendedor.cuit} no es el titular actual del vehículo`,
        );
      }

      // Validación PL/SQL: Debe haber exactamente un responsable
      // En este caso validamos que el comprador sea responsable
      if (!comprador.esResponsable) {
        throw new BadRequestException(
          'Debe seleccionar un único responsable tributario',
        );
      }

      // Validar fecha de transferencia
      const fechaTransferencia = new Date(
        transferencia.fechaTransferencia || comprador.fechaInicioVinculo,
      );
      const fechaInicio = new Date(comprador.fechaInicioVinculo);

      // Calcular fecha de fin del vínculo anterior (un día antes de la nueva fecha de inicio)
      const fechaFinAnterior = new Date(fechaInicio);
      fechaFinAnterior.setDate(fechaFinAnterior.getDate() - 1);

      // Validaciones de fechas
      if (isNaN(fechaInicio.getTime())) {
        throw new BadRequestException(
          'La fecha de inicio del vínculo no es válida',
        );
      }

      if (isNaN(new Date(documentacion.fechaAltaTransferencia).getTime())) {
        throw new BadRequestException(
          'La fecha de alta de transferencia no es válida',
        );
      }

      // Validaciones adicionales
      if (
        comprador.porcentajePropiedad < 0 ||
        comprador.porcentajePropiedad > 100
      ) {
        throw new BadRequestException(
          'El porcentaje de propiedad debe estar entre 0 y 100',
        );
      }

      // Cerrar el vínculo anterior
      await this.vinculoRepository.updateFechaHasta(
        titularActual.id,
        fechaFinAnterior,
      );

      // Validaciones de longitud de campos para la base de datos
      if (comprador.tipoVinculo.length > 5) {
        throw new BadRequestException(
          `El tipo de vínculo '${comprador.tipoVinculo}' excede la longitud máxima permitida (5 caracteres)`,
        );
      }

      if (documentacion.usuarioAlta.length > 10) {
        // Truncamos automáticamente para evitar errores
        console.warn(
          `Usuario '${documentacion.usuarioAlta}' truncado a 10 caracteres`,
        );
      }

      // Crear el nuevo vínculo con el comprador
      const nuevoVinculo = await this.vinculoRepository.create({
        sujetoPasivoId: Number(compradorEntity.id),
        objetoValorPredeterminadoId: vehiculo.archivoId,
        ptvId: comprador.tipoVinculo.substring(0, 5),
        fechaInicio: fechaInicio,
        fechaFin: null,
        fechaBaja: null,
        porcentaje: Number(comprador.porcentajePropiedad),
        responsable: comprador.esResponsable ? 'S' : 'N',
        usuarioAlta: documentacion.usuarioAlta.substring(0, 10),
        fechaAlta: new Date(documentacion.fechaAltaTransferencia),
      });

      return {
        success: true,
        message: 'Transferencia registrada correctamente',
        data: {
          transferenciaId: nuevoVinculo.id,
          vehiculo: {
            dominio: vehiculo.dominio,
            archivoId: vehiculo.archivoId,
            codigoAlta: vehiculo.codigoAlta,
            fechaAlta: vehiculo.fechaAlta,
            fechaInicio: vehiculo.fechaInicio,
            fechaRige: vehiculo.fechaRige,
            origenRnpa: vehiculo.origenRnpa,
            marcaRnpa: vehiculo.marcaRnpa,
            tipoRnpa: vehiculo.tipoRnpa,
          },
          vendedor: {
            cuit: vendedorEntity.cuit,
            denominacion: vendedorEntity.denominacion,
            descripcion: vendedor.descripcion,
            fechaFinVinculo: fechaFinAnterior,
          },
          comprador: {
            cuit: compradorEntity.cuit,
            denominacion: compradorEntity.denominacion,
            descripcion: comprador.descripcion,
            fechaInicioVinculo: nuevoVinculo.fechaInicio,
            porcentajePropiedad: nuevoVinculo.porcentaje,
            tipoVinculo: nuevoVinculo.ptvId,
            esResponsable: nuevoVinculo.responsable === 'S',
          },
          transferencia: {
            tipo: transferencia.tipoTransferencia,
            fechaTransferencia: fechaTransferencia,
            monto: transferencia.montoOperacion,
            moneda: transferencia.moneda,
          },
          documentacion: {
            documentosPresentados: documentacion.documentosPresentados,
            situacionEspecial: documentacion.situacionEspecial,
            observaciones: documentacion.observaciones || null,
            usuarioAlta: documentacion.usuarioAlta,
            fechaAlta: nuevoVinculo.fechaAlta,
          },
        },
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Error al registrar transferencia: ${error.message}`,
      );
    }
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
