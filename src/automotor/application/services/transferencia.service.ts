import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TransferenciaRepositoryPort } from '../../domain/ports/transferencia-repository.port';
import { SujetoPasivoRepositoryPort } from '../../domain/ports/sujeto-pasivo-repository.port';
import { ObjetoValorPredeterminadoRepositoryPort } from '../../domain/ports/objeto-valor-predeterminado-repository.port';
import { Transferencia } from '../../infrastructure/entities/transferencia.entity';

export interface CrearTransferenciaDto {
  ovpOvpId: number;
  spoId: number;
  spoIdNuevoDueno: number;
  fechaTransferencia: Date;
  pmaId: string;
  importeSellos?: number;
  importeTransferencia?: number;
  atrDominio: string;
  atrPthId: string;
  usuarioAlta: string;
}

@Injectable()
export class TransferenciaService {
  constructor(
    @Inject('TransferenciaRepositoryPort')
    private readonly transferenciaRepository: TransferenciaRepositoryPort,
    @Inject('SujetoPasivoRepositoryPort')
    private readonly sujetoPasivoRepository: SujetoPasivoRepositoryPort,
    @Inject('ObjetoValorPredeterminadoRepositoryPort')
    private readonly objetoValorRepository: ObjetoValorPredeterminadoRepositoryPort,
  ) {}

  async crearTransferencia(dto: CrearTransferenciaDto): Promise<Transferencia> {
    await this.validarTransferencia(dto);

    const transferencia = await this.transferenciaRepository.create({
      ...dto,
      fechaAlta: new Date(),
    });

    return transferencia;
  }

  async obtenerTransferenciaPorId(id: number): Promise<Transferencia> {
    const transferencia = await this.transferenciaRepository.findById(id);
    if (!transferencia) {
      throw new NotFoundException(`Transferencia con ID ${id} no encontrada`);
    }
    return transferencia;
  }

  async obtenerTransferenciasPorDominio(
    dominio: string,
  ): Promise<Transferencia[]> {
    return await this.transferenciaRepository.findByDominio(dominio);
  }

  async obtenerTransferenciasPorSujetoPasivo(
    sujetoPasivoId: number,
  ): Promise<Transferencia[]> {
    return await this.transferenciaRepository.findBySujetoPasivo(
      sujetoPasivoId,
    );
  }

  async obtenerTodasLasTransferencias(): Promise<Transferencia[]> {
    return await this.transferenciaRepository.findAll();
  }

  private async validarTransferencia(
    dto: CrearTransferenciaDto,
  ): Promise<void> {
    if (dto.spoId === dto.spoIdNuevoDueno) {
      throw new BadRequestException(
        'El propietario actual y el nuevo no pueden ser el mismo',
      );
    }

    const sujetoPasivoActual = await this.sujetoPasivoRepository.findById(
      dto.spoId,
    );
    if (!sujetoPasivoActual) {
      throw new NotFoundException(
        `Sujeto pasivo actual con ID ${dto.spoId} no encontrado`,
      );
    }

    const sujetoPasivoNuevo = await this.sujetoPasivoRepository.findById(
      dto.spoIdNuevoDueno,
    );
    if (!sujetoPasivoNuevo) {
      throw new NotFoundException(
        `Sujeto pasivo nuevo con ID ${dto.spoIdNuevoDueno} no encontrado`,
      );
    }

    const objetoValor = await this.objetoValorRepository.findById(dto.ovpOvpId);
    if (!objetoValor) {
      throw new NotFoundException(
        `Objeto valor predeterminado con ID ${dto.ovpOvpId} no encontrado`,
      );
    }
  }
}
