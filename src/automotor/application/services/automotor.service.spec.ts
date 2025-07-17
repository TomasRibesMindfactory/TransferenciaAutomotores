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
        dominio: 'ABC123',
        modelo: 'Gol Trend',
        codigoAlta: 12345,
        registroId: 67890,
        marca: 'Volkswagen',
        fechaAlta: new Date('2020-01-15'),
        fechaBaja: null,
        objetosValorPredeterminado: [],
      };

      const mockObjetosValor = [
        {
          id: 1,
          automotorId: 1,
          fechaVigencia: new Date('2024-01-01'),
          valor: 1500000.0,
          automotor: null, // or a mock automotor object if needed
          vinculos: [], // or a mock array if needed
        },
      ];

      automotorRepository.findByDominio.mockResolvedValue(mockAutomotor);
      ovpRepository.findByAutomotorId.mockResolvedValue(mockObjetosValor);

      const result = await service.consultarPorDominio('ABC123');

      expect(result).toEqual({
        modelo: 'Gol Trend',
        codigoAlta: 12345,
        registroId: 67890,
        marca: 'Volkswagen',
        fechaAlta: new Date('2020-01-15'),
        fechaVigencia: new Date('2024-01-01'),
        valorVigente: 1500000.0,
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
        razonSocial: 'María González',
        fechaAlta: new Date('2020-01-01'),
        fechaBaja: null,
        vinculos: [],
      };

      const mockOvp = {
        id: 1,
        automotorId: 1,
        fechaVigencia: new Date('2024-01-01'),
        valor: 1500000.0,
        automotor: null,
        vinculos: [],
      };

      const mockNuevoVinculo = {
        id: 1,
        sujetoPasivoId: 2,
        objetoValorPredeterminadoId: 1,
        fechaInicio: new Date('2024-01-15'),
        fechaHasta: null,
        fechaBaja: null,
        porcentaje: 100,
        responsable: 'S',
        sujetoPasivo: mockNuevoTitular,
        objetoValorPredeterminado: mockOvp,
      };

      sujetoPasivoRepository.findByCuit.mockResolvedValue(mockNuevoTitular);
      ovpRepository.findById.mockResolvedValue(mockOvp);
      vinculoRepository.findTitularActual.mockResolvedValue(null);
      vinculoRepository.create.mockResolvedValue(mockNuevoVinculo);

      const result = await service.registrarTransferencia(1, transferenciaDto);

      expect(result.mensaje).toBe('✔ Transferencia registrada correctamente.');
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
