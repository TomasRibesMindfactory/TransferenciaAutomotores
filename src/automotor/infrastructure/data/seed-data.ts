import { Automotor } from '../entities/automotor.entity';
import { SujetoPasivo } from '../entities/sujeto-pasivo.entity';
import { ObjetoValorPredeterminado } from '../entities/objeto-valor-predeterminado.entity';
import { VinculoSujetoObjeto } from '../entities/vinculo-sujeto-objeto.entity';
import { Transferencia } from '../entities/transferencia.entity';
import { VinculoSituacionEspecial } from '../entities/vinculo-situacion-especial.entity';

export const seedAutomotores: Partial<Automotor>[] = [
  {
    dominio: 'ABC123',
    fechaInicio: new Date('2020-01-15'),
    fechaFabricacion: 2020,
    fechaRige: new Date('2020-01-15'),
    pcaPtaId: '001',
    pcaId: '001',
    pthId: 'AUTO',
    usuarioAlta: 'SYSTEM',
    fechaAlta: new Date('2020-01-15'),
    numeroChasis: '12345678901234567',
    numeroMotor: 'MOT123456',
    color: 'Rojo',
  },
  {
    dominio: 'XYZ789',
    fechaInicio: new Date('2019-06-20'),
    fechaFabricacion: 2019,
    fechaRige: new Date('2019-06-20'),
    pcaPtaId: '001',
    pcaId: '002',
    pthId: 'AUTO',
    usuarioAlta: 'SYSTEM',
    fechaAlta: new Date('2019-06-20'),
    numeroChasis: '98765432109876543',
    numeroMotor: 'MOT987654',
    color: 'Azul',
  },
  {
    dominio: 'DEF456',
    fechaInicio: new Date('2021-03-10'),
    fechaFabricacion: 2021,
    fechaRige: new Date('2021-03-10'),
    pcaPtaId: '001',
    pcaId: '003',
    pthId: 'AUTO',
    usuarioAlta: 'SYSTEM',
    fechaAlta: new Date('2021-03-10'),
    numeroChasis: '11111111111111111',
    numeroMotor: 'MOT111111',
    color: 'Blanco',
  },
];

export const seedSujetosPasivos: Partial<SujetoPasivo>[] = [
  {
    cuit: '20-12345678-9',
    tipoSujetoPasivo: 'F',
    denominacion: 'Juan Pérez',
    fechaInicio: new Date('2020-01-01'),
    pcaId: '001',
    pcaPtaId: '001',
    usuarioAlta: 'SYSTEM',
    fechaAlta: new Date('2020-01-01'),
  },
  {
    cuit: '20-87654321-0',
    tipoSujetoPasivo: 'F',
    denominacion: 'María González',
    fechaInicio: new Date('2020-02-01'),
    pcaId: '001',
    pcaPtaId: '001',
    usuarioAlta: 'SYSTEM',
    fechaAlta: new Date('2020-02-01'),
  },
  {
    cuit: '20-11111111-1',
    tipoSujetoPasivo: 'F',
    denominacion: 'Carlos Rodríguez',
    fechaInicio: new Date('2020-03-01'),
    pcaId: '001',
    pcaPtaId: '001',
    usuarioAlta: 'SYSTEM',
    fechaAlta: new Date('2020-03-01'),
  },
  {
    cuit: '20-22222222-2',
    tipoSujetoPasivo: 'F',
    denominacion: 'Ana Martínez',
    fechaInicio: new Date('2020-04-01'),
    pcaId: '001',
    pcaPtaId: '001',
    usuarioAlta: 'SYSTEM',
    fechaAlta: new Date('2020-04-01'),
  },
];

export const seedObjetosValorPredeterminado: Partial<ObjetoValorPredeterminado>[] =
  [
    {
      fechaInicio: new Date('2020-01-15'),
      tipo: 'A',
      atrId: 1,
      atrDominio: 'ABC123',
      atrPthId: 'AUTO',
      usuarioAlta: 'SYSTEM',
      fechaAlta: new Date('2020-01-15'),
    },
    {
      fechaInicio: new Date('2019-06-20'),
      tipo: 'A',
      atrId: 2,
      atrDominio: 'XYZ789',
      atrPthId: 'AUTO',
      usuarioAlta: 'SYSTEM',
      fechaAlta: new Date('2019-06-20'),
    },
    {
      fechaInicio: new Date('2021-03-10'),
      tipo: 'A',
      atrId: 3,
      atrDominio: 'DEF456',
      atrPthId: 'AUTO',
      usuarioAlta: 'SYSTEM',
      fechaAlta: new Date('2021-03-10'),
    },
  ];

export const seedVinculosSujetoObjeto: Partial<VinculoSujetoObjeto>[] = [
  {
    sujetoPasivoId: 1,
    objetoValorPredeterminadoId: 1,
    ptvId: 'PROP',
    fechaInicio: new Date('2020-01-15'),
    fechaFin: null,
    porcentaje: 100.0,
    responsable: 'S',
    usuarioAlta: 'SYSTEM',
    fechaAlta: new Date('2020-01-15'),
  },
  {
    sujetoPasivoId: 2,
    objetoValorPredeterminadoId: 2,
    ptvId: 'PROP',
    fechaInicio: new Date('2019-06-20'),
    fechaFin: null,
    porcentaje: 100.0,
    responsable: 'S',
    usuarioAlta: 'SYSTEM',
    fechaAlta: new Date('2019-06-20'),
  },
  {
    sujetoPasivoId: 3,
    objetoValorPredeterminadoId: 3,
    ptvId: 'PROP',
    fechaInicio: new Date('2021-03-10'),
    fechaFin: null,
    porcentaje: 100.0,
    responsable: 'S',
    usuarioAlta: 'SYSTEM',
    fechaAlta: new Date('2021-03-10'),
  },
];

export const seedTransferencias: Partial<Transferencia>[] = [
  {
    ovpOvpId: 1,
    spoId: 1,
    spoIdNuevoDueno: 2,
    fechaTransferencia: new Date('2024-01-15'),
    pmaId: 'PESO',
    importeTransferencia: 1500000.0,
    usuarioAlta: 'SYSTEM',
    fechaAlta: new Date('2024-01-15'),
    atrDominio: 'ABC123',
    atrPthId: 'AUTO',
  },
];

export const seedVinculosSituacionEspecial: Partial<VinculoSituacionEspecial>[] =
  [
    {
      selId: 1,
      spoId: 1,
      tipoObjetoId: 'A',
      objetoId: 1,
      expedienteAlta: 'EXP-2024-001',
      usuarioAlta: 'SYSTEM',
      fechaAlta: new Date('2024-01-01'),
      fechaInicio: new Date('2024-01-01'),
      os: 'S',
    },
  ];
