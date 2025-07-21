import { Injectable, Inject } from '@nestjs/common';
import { AutomotorRepositoryPort } from '../../domain/ports/automotor-repository.port';
import { SujetoPasivoRepositoryPort } from '../../domain/ports/sujeto-pasivo-repository.port';
import { ParTipoVehiculoRepositoryPort } from '../../domain/ports/par-tipo-vehiculo-repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParRegistroAutomotor } from '../../infrastructure/entities/par-registro-automotor.entity';
import { ParModelo } from '../../infrastructure/entities/par-modelo.entity';
import { ParCodigoAlta } from '../../infrastructure/entities/par-codigo-alta.entity';
import { ParMoneda } from '../../infrastructure/entities/par-moneda.entity';
import { Automotor } from '../../infrastructure/entities/automotor.entity';
import { ObjetoValorPredeterminado } from '../../infrastructure/entities/objeto-valor-predeterminado.entity';

export interface ValidationResult {
  success: boolean;
  data?: any;
  message?: string;
}

export interface DominioValidationResult extends ValidationResult {
  data?: {
    // Datos básicos del automotor
    atrId?: number;
    atrDominio?: string;
    atrPthId?: string;
    atrPmoId?: string;
    atrPcaId?: string;
    atrPrtId?: string;
    atrFechaAlta?: Date;
    atrFechaInicio?: Date;
    atrFechaFabricacion?: number;
    atrFechaRige?: Date;
    atrUsuarioAlta?: string;
    atrFechaUltimaActualizacion?: Date;
    atrIdMarcaRnpa?: string;
    atrIdTipoRnpa?: string;
    atrIdModeloRnpa?: string;
    atrOrigenRnpa?: string;

    // Descripciones auto-rellenadas
    pmoDescripcion?: string;
    pcaDescripcion?: string;
    prtDescripcion?: string;
    marcaDescripcion?: string;
    tipoDescripcion?: string;
    modeloDescripcion?: string;
    municipioDesc?: string;

    // ID del objeto valor predeterminado
    ovpId?: number;
  };
}

export interface CuitValidationResult extends ValidationResult {
  data?: {
    spoId?: number;
    spoDenominacion?: string;
    spoFechaBaja?: Date;
  };
}

export interface ParametricValidationResult extends ValidationResult {
  data?: {
    descripcion?: string;
  };
}

@Injectable()
export class ValidationsService {
  constructor(
    @Inject('AutomotorRepositoryPort')
    private readonly automotorRepository: AutomotorRepositoryPort,
    @Inject('SujetoPasivoRepositoryPort')
    private readonly sujetoPasivoRepository: SujetoPasivoRepositoryPort,
    @Inject('ParTipoVehiculoRepositoryPort')
    private readonly parTipoVehiculoRepository: ParTipoVehiculoRepositoryPort,
    @InjectRepository(ParRegistroAutomotor)
    private readonly parRegistroRepository: Repository<ParRegistroAutomotor>,
    @InjectRepository(ParModelo)
    private readonly parModeloRepository: Repository<ParModelo>,
    @InjectRepository(ParCodigoAlta)
    private readonly parCodigoAltaRepository: Repository<ParCodigoAlta>,
    @InjectRepository(ParMoneda)
    private readonly parMonedaRepository: Repository<ParMoneda>,
    @InjectRepository(Automotor)
    private readonly automotorEntityRepository: Repository<Automotor>,
    @InjectRepository(ObjetoValorPredeterminado)
    private readonly ovpRepository: Repository<ObjetoValorPredeterminado>,
  ) {}

  /**
   * Valida un dominio y retorna todos los datos del automotor
   * Equivale a VERIFICAR_DOMINIO + EXECUTE_QUERY en Oracle Forms
   */
  async validateDominio(dominio: string): Promise<DominioValidationResult> {
    try {
      // Buscar el automotor por dominio
      const automotor = await this.automotorEntityRepository
        .createQueryBuilder('atr')
        .leftJoinAndSelect('atr.objetosValorPredeterminado', 'ovp')
        .where('atr.dominio = :dominio', { dominio })
        .andWhere('atr.fechaFin IS NULL')
        .andWhere('atr.pcjId IS NULL')
        .getOne();

      if (!automotor) {
        return {
          success: false,
          message: `Dominio ${dominio} no encontrado o no está activo`,
        };
      }

      // Obtener descripciones de tablas paramétricas
      const [tipoVehiculo, modelo, codigoAlta, registroAutomotor] =
        await Promise.all([
          this.parTipoVehiculoRepository.findById(automotor.pthId),
          automotor.pmoId
            ? this.parModeloRepository.findOne({
                where: { id: automotor.pmoId },
              })
            : null,
          automotor.pcaId
            ? this.parCodigoAltaRepository.findOne({
                where: { id: automotor.pcaId },
              })
            : null,
          automotor.prtId
            ? this.parRegistroRepository.findOne({
                where: { id: automotor.prtId },
              })
            : null,
        ]);

      return {
        success: true,
        message: 'Dominio válido',
        data: {
          // Datos básicos del automotor
          atrId: automotor.id,
          atrDominio: automotor.dominio,
          atrPthId: automotor.pthId,
          atrPmoId: automotor.pmoId,
          atrPcaId: automotor.pcaId,
          atrPrtId: automotor.prtId,
          atrFechaAlta: automotor.fechaAlta,
          atrFechaInicio: automotor.fechaInicio,
          atrFechaFabricacion: automotor.fechaFabricacion,
          atrFechaRige: automotor.fechaRige,
          atrUsuarioAlta: automotor.usuarioAlta,
          atrFechaUltimaActualizacion: automotor.fechaUltMod,
          atrIdMarcaRnpa: automotor.idMarcaRnpa,
          atrIdTipoRnpa: automotor.idTipoRnpa,
          atrIdModeloRnpa: automotor.idModeloRnpa,
          atrOrigenRnpa: automotor.origenRnpa,

          // Descripciones auto-rellenadas
          marcaDescripcion: automotor.idMarcaRnpa, // TODO: Obtener de tabla de marcas
          tipoDescripcion: tipoVehiculo?.descripcion,
          modeloDescripcion: modelo?.descripcion,
          pmoDescripcion: modelo?.descripcion,
          pcaDescripcion: codigoAlta?.descripcion,
          prtDescripcion: registroAutomotor?.descripcion,
          municipioDesc: '', // TODO: Implementar vínculo con municipios

          // ID del objeto valor predeterminado
          ovpId: automotor.objetosValorPredeterminado?.[0]?.id,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al validar dominio: ${error.message}`,
      };
    }
  }

  /**
   * Valida un CUIT y retorna los datos del sujeto pasivo
   * Equivale a obtiene_cuit en Oracle Forms
   */
  async validateCuit(cuit: string): Promise<CuitValidationResult> {
    try {
      const sujetoPasivo = await this.sujetoPasivoRepository.findByCuit(cuit);

      if (!sujetoPasivo) {
        return {
          success: false,
          message: `CUIT ${cuit} no encontrado`,
        };
      }

      return {
        success: true,
        message: 'CUIT válido',
        data: {
          spoId: sujetoPasivo.id,
          spoDenominacion: sujetoPasivo.denominacion,
          spoFechaBaja: sujetoPasivo.fechaBaja,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al validar CUIT: ${error.message}`,
      };
    }
  }

  /**
   * Valida código de alta y retorna su descripción
   * Equivale a CGFK$CHK_AUTOMOTORES_ATR_PCA_F
   */
  async validateCodigoAlta(
    pcaId: string,
    ptaId?: string,
  ): Promise<ParametricValidationResult> {
    try {
      const whereCondition: any = { id: pcaId };
      if (ptaId) {
        whereCondition.ptaId = ptaId;
      }

      const codigoAlta = await this.parCodigoAltaRepository.findOne({
        where: whereCondition,
      });

      if (!codigoAlta) {
        return {
          success: false,
          message: `Código de alta ${pcaId} no encontrado`,
        };
      }

      return {
        success: true,
        message: 'Código de alta válido',
        data: {
          descripcion: codigoAlta.descripcion,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al validar código de alta: ${error.message}`,
      };
    }
  }

  /**
   * Valida registro automotor y retorna su descripción
   * Equivale a CGFK$QRY_AUTOMOTORES_ATR_PRT_F
   */
  async validateRegistroAutomotor(
    prtId: string,
  ): Promise<ParametricValidationResult> {
    try {
      const registro = await this.parRegistroRepository.findOne({
        where: { id: prtId },
      });

      if (!registro) {
        return {
          success: false,
          message: `Registro automotor ${prtId} no encontrado`,
        };
      }

      return {
        success: true,
        message: 'Registro automotor válido',
        data: {
          descripcion: registro.descripcion,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al validar registro automotor: ${error.message}`,
      };
    }
  }

  /**
   * Valida tipo de vehículo y retorna su descripción
   * Equivale a CGFK$CHK_AUTOMOTORES_ATR_PTH_F
   */
  async validateTipoVehiculo(
    pthId: string,
  ): Promise<ParametricValidationResult> {
    try {
      const tipoVehiculo = await this.parTipoVehiculoRepository.findById(pthId);

      if (!tipoVehiculo) {
        return {
          success: false,
          message: `Tipo de vehículo ${pthId} no encontrado`,
        };
      }

      return {
        success: true,
        message: 'Tipo de vehículo válido',
        data: {
          descripcion: tipoVehiculo.descripcion,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al validar tipo de vehículo: ${error.message}`,
      };
    }
  }

  /**
   * Valida modelo RNPA y retorna su descripción
   * Equivale a CGFK$QRY_AUTOMOTORES_ATR_PMO_F
   */
  async validateModeloRnpa(pmoId: string): Promise<ParametricValidationResult> {
    try {
      const modelo = await this.parModeloRepository.findOne({
        where: { id: pmoId },
      });

      if (!modelo) {
        return {
          success: false,
          message: `Modelo RNPA ${pmoId} no encontrado`,
        };
      }

      return {
        success: true,
        message: 'Modelo RNPA válido',
        data: {
          descripcion: modelo.descripcion,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al validar modelo RNPA: ${error.message}`,
      };
    }
  }

  /**
   * Valida moneda y retorna su descripción
   * Equivale a CGFK$CHK_TRANSFERENCIAS_TFA_PM
   */
  async validateMoneda(pmaId: string): Promise<ParametricValidationResult> {
    try {
      const moneda = await this.parMonedaRepository.findOne({
        where: { id: pmaId },
      });

      if (!moneda) {
        return {
          success: false,
          message: `Moneda ${pmaId} no encontrada`,
        };
      }

      return {
        success: true,
        message: 'Moneda válida',
        data: {
          descripcion: moneda.descripcion,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al validar moneda: ${error.message}`,
      };
    }
  }
}
