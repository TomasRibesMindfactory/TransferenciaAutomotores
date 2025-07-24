import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AutomotorService } from './automotor.service';
import { AutomotorRepositoryPort } from '../../domain/ports/automotor-repository.port';
import { SujetoPasivoRepositoryPort } from '../../domain/ports/sujeto-pasivo-repository.port';
import { VinculoSujetoObjetoRepositoryPort } from '../../domain/ports/vinculo-sujeto-objeto-repository.port';
import { ObjetoValorPredeterminadoRepositoryPort } from '../../domain/ports/objeto-valor-predeterminado-repository.port';
import { TransferenciaAutomotorDto } from '../../infrastructure/dto/transferencia-automotor.dto';

describe('AutomotorService', () => {
  let service: AutomotorService;
  let automotorRepository: jest.Mocked<AutomotorRepositoryPort>;
  let sujetoPasivoRepository: jest.Mocked<SujetoPasivoRepositoryPort>;
  let vinculoRepository: jest.Mocked<VinculoSujetoObjetoRepositoryPort>;

  let ovpRepository: jest.Mocked<ObjetoValorPredeterminadoRepositoryPort>;

  beforeEach(async () => {
    const mockAutomotorRepository = {
      findByDominio: jest.fn(),
      findById: jest.fn(),
    };

    const mockSujetoPasivoRepository = {
      findByCuit: jest.fn(),
      findById: jest.fn(),
    };

    const mockVinculoRepository = {
      findTitularActual: jest.fn(),
      create: jest.fn(),
      updateFechaHasta: jest.fn(),
    };

    const mockOvpRepository = {
      findByAutomotorId: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutomotorService,
        {
          provide: 'AutomotorRepositoryPort',
          useValue: mockAutomotorRepository,
        },
        {
          provide: 'SujetoPasivoRepositoryPort',
          useValue: mockSujetoPasivoRepository,
        },
        {
          provide: 'VinculoSujetoObjetoRepositoryPort',
          useValue: mockVinculoRepository,
        },
        {
          provide: 'ObjetoValorPredeterminadoRepositoryPort',
          useValue: mockOvpRepository,
        },
      ],
    }).compile();

    service = module.get<AutomotorService>(AutomotorService);
    automotorRepository = module.get('AutomotorRepositoryPort');
    sujetoPasivoRepository = module.get('SujetoPasivoRepositoryPort');
    vinculoRepository = module.get('VinculoSujetoObjetoRepositoryPort');
    ovpRepository = module.get('ObjetoValorPredeterminadoRepositoryPort');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('consultarPorDominio', () => {
    it('should return automotor data when found', async () => {
      const mockAutomotor = {
        id: 1,
        fechaInicio: new Date('2020-01-15'),
        dominio: 'ABC123',
        numeroChasis: 'CH123456789',
        numeroMotor: 'MT987654321',
        carroceria: 'Sedan',
        color: 'Blanco',
        fechaFabricacion: 2020,
        fechaRige: new Date('2020-01-15'),
        fechaAltaRegistro: new Date('2020-01-15'),
        fechaBajaRegistro: null,
        numeroExpedienteBaja: null,
        ppaId: '12345',
        pmoId: '123456789',
        ppaPpsId: '12345',
        prtId: '12345',
        pceId: '12345',
        pcaPtaId: '12345',
        pcaId: '12345',
        pcjPtbId: '12345',
        pcjId: '12345',
        usuarioAlta: 'admin',
        fechaAlta: new Date('2020-01-15'),
        usuarioUltMod: null,
        fechaFin: null,
        fechaUltMod: null,
        usuarioBaja: null,
        fechaBaja: null,
        ppsId: '12345',
        puoId: '12345',
        pthId: '12345',
        modeloAnio: 2020,
        dominioViejo: null,
        fechaVigenciaAforo: null,
        prmId: '123',
        medida: 1200,
        idMarcaRnpa: '1234567890',
        idTipoRnpa: '12345678',
        idModeloRnpa: '123456789012',
        origenRnpa: 'A',
        observaciones: '',
        objetosValorPredeterminado: [],
      };

      const mockObjetosValor = [
        {
          id: 1,
          fechaInicio: new Date('2024-01-01'),
          tipo: 'A',
          fechaFin: null,
          imePartidaInmobiliaria: null,
          atrDominio: 'ABC123',
          tloNroConsolidacion: null,
          atrPthId: '12345',
          puoId: '12345',
          usuarioAlta: 'admin',
          fechaAlta: new Date('2024-01-01'),
          usuarioUltMod: null,
          fechaUltMod: null,
          usuarioBaja: null,
          fechaBaja: null,
          atrId: 1,
          automotor: null,
          vinculos: [],
        },
      ];

      automotorRepository.findByDominio.mockResolvedValue(mockAutomotor);
      ovpRepository.findByAutomotorId.mockResolvedValue(mockObjetosValor);

      const result = await service.consultarPorDominio('ABC123');

      expect(result).toEqual({
        dominio: 'ABC123',
        fechaInicio: new Date('2020-01-15'),
        fechaFabricacion: 2020,
        pthId: '12345',
        fechaAlta: new Date('2020-01-15'),
        numeroChasis: 'CH123456789',
        numeroMotor: 'MT987654321',
        color: 'Blanco',
      });
    });

    it('should throw NotFoundException when automotor not found', async () => {
      automotorRepository.findByDominio.mockResolvedValue(null);

      await expect(service.consultarPorDominio('INVALID')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('registrarTransferencia', () => {
    it('should register transfer successfully', async () => {
      const transferenciaDto: TransferenciaAutomotorDto = {
        cuit: '20-12345678-9',
        porcentaje: 100,
        fechaInicio: '2024-01-15',
        responsable: true,
      };

      const mockNuevoTitular = {
        id: 2,
        cuit: '20-12345678-9',
        tipoSujetoPasivo: 'F',
        denominacion: 'María González',
        tamanio: null,
        numeroContratista: null,
        numeroProveedorEstado: null,
        telefono: null,
        fax: null,
        correoElectronico: null,
        condicionDgi: null,
        fechaInicio: new Date('2020-01-01'),
        fechaFin: null,
        fechaInscripRegistro: null,
        numeroInscripRegistro: null,
        nombreFantasia: null,
        cantidadSucursales: null,
        cantidadPersonalPerman: null,
        cantidadPersonalTransi: null,
        lugarFallecimiento: null,
        fechaFallecimiento: null,
        numeroAutos: null,
        caratulaExpediente: null,
        tipoJuzgado: null,
        numeroJuzgado: null,
        secretaria: null,
        observaciones: null,
        prcPtcPscPpcId: null,
        prcPtcPscId: null,
        prcPtcId: null,
        prcId: null,
        usuarioAlta: 'admin',
        fechaAlta: new Date('2020-01-01'),
        usuarioUltMod: null,
        fechaUltMod: null,
        usuarioBaja: null,
        fechaBaja: null,
        pcjId: null,
        pcjPtbId: null,
        pcaId: '12345',
        pcaPtaId: '12345',
        vinculos: [],
      };

      const mockOvp = {
        id: 1,
        fechaInicio: new Date('2024-01-01'),
        tipo: 'A',
        fechaFin: null,
        imePartidaInmobiliaria: null,
        atrDominio: 'ABC123',
        tloNroConsolidacion: null,
        atrPthId: '12345',
        puoId: '12345',
        usuarioAlta: 'admin',
        fechaAlta: new Date('2024-01-01'),
        usuarioUltMod: null,
        fechaUltMod: null,
        usuarioBaja: null,
        fechaBaja: null,
        atrId: 1,
        automotor: null,
        vinculos: [],
      };

      const mockNuevoVinculo = {
        id: 1,
        sujetoPasivoId: 2,
        objetoValorPredeterminadoId: 1,
        ptvId: '12345',
        fechaInicio: new Date('2024-01-15'),
        pcjId: null,
        pcjPtbId: null,
        fechaFin: null,
        porcentaje: 100,
        responsable: 'S',
        usuarioAlta: 'admin',
        fechaAlta: new Date('2024-01-15'),
        usuarioUltMod: null,
        fechaUltMod: null,
        usuarioBaja: null,
        fechaBaja: null,
        regActivos: null,
        sujetoPasivo: mockNuevoTitular,
        objetoValorPredeterminado: mockOvp,
      };

      sujetoPasivoRepository.findByCuit.mockResolvedValue(mockNuevoTitular);
      ovpRepository.findById.mockResolvedValue(mockOvp);
      vinculoRepository.findTitularActual.mockResolvedValue(null);
      vinculoRepository.create.mockResolvedValue(mockNuevoVinculo);

      const result = await service.registrarTransferencia(1, transferenciaDto);

      expect(result.mensaje).toBe('Transferencia registrada correctamente.');
      expect(result.transferencia.nuevoTitular.cuit).toBe('20-12345678-9');
      expect(result.transferencia.porcentaje).toBe(100);
    });

    it('should throw BadRequestException when CUIT does not exist', async () => {
      const transferenciaDto: TransferenciaAutomotorDto = {
        cuit: '20-99999999-9',
        porcentaje: 100,
        fechaInicio: '2024-01-15',
        responsable: true,
      };

      sujetoPasivoRepository.findByCuit.mockResolvedValue(null);

      await expect(
        service.registrarTransferencia(1, transferenciaDto),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
