import { Automotor } from '../entities/automotor.entity';
import { SujetoPasivo } from '../entities/sujeto-pasivo.entity';
import { ObjetoValorPredeterminado } from '../entities/objeto-valor-predeterminado.entity';
import { VinculoSujetoObjeto } from '../entities/vinculo-sujeto-objeto.entity';

export const seedAutomotores: Partial<Automotor>[] = [
  {
    dominio: 'ABC123',
    modelo: 'Gol Trend',
    codigoAlta: 12345,
    registroId: 67890,
    marca: 'Volkswagen',
    fechaAlta: new Date('2020-01-15'),
    fechaBaja: null,
  },
  {
    dominio: 'XYZ789',
    modelo: 'Corolla',
    codigoAlta: 54321,
    registroId: 98765,
    marca: 'Toyota',
    fechaAlta: new Date('2019-06-20'),
    fechaBaja: null,
  },
  {
    dominio: 'DEF456',
    modelo: 'Civic',
    codigoAlta: 11111,
    registroId: 22222,
    marca: 'Honda',
    fechaAlta: new Date('2021-03-10'),
    fechaBaja: null,
  },
];

export const seedSujetosPasivos: Partial<SujetoPasivo>[] = [
  {
    cuit: '20-12345678-9',
    razonSocial: 'Juan Pérez',
    fechaAlta: new Date('2020-01-01'),
    fechaBaja: null,
  },
  {
    cuit: '20-87654321-0',
    razonSocial: 'María González',
    fechaAlta: new Date('2020-02-01'),
    fechaBaja: null,
  },
  {
    cuit: '20-11111111-1',
    razonSocial: 'Carlos Rodríguez',
    fechaAlta: new Date('2020-03-01'),
    fechaBaja: null,
  },
  {
    cuit: '20-22222222-2',
    razonSocial: 'Ana Martínez',
    fechaAlta: new Date('2020-04-01'),
    fechaBaja: null,
  },
];

export const seedObjetosValorPredeterminado: Partial<ObjetoValorPredeterminado>[] = [
  {
    automotorId: 1,
    fechaVigencia: new Date('2024-01-01'),
    valor: 1500000.00,
  },
  {
    automotorId: 1,
    fechaVigencia: new Date('2023-01-01'),
    valor: 1400000.00,
  },
  {
    automotorId: 2,
    fechaVigencia: new Date('2024-01-01'),
    valor: 2500000.00,
  },
  {
    automotorId: 3,
    fechaVigencia: new Date('2024-01-01'),
    valor: 1800000.00,
  },
];

export const seedVinculosSujetoObjeto: Partial<VinculoSujetoObjeto>[] = [
  {
    sujetoPasivoId: 1,
    objetoValorPredeterminadoId: 1,
    fechaInicio: new Date('2020-01-15'),
    fechaHasta: null,
    fechaBaja: null,
    porcentaje: 100.00,
    responsable: 'S',
  },
  {
    sujetoPasivoId: 2,
    objetoValorPredeterminadoId: 3,
    fechaInicio: new Date('2019-06-20'),
    fechaHasta: null,
    fechaBaja: null,
    porcentaje: 100.00,
    responsable: 'S',
  },
  {
    sujetoPasivoId: 3,
    objetoValorPredeterminadoId: 4,
    fechaInicio: new Date('2021-03-10'),
    fechaHasta: null,
    fechaBaja: null,
    porcentaje: 100.00,
    responsable: 'S',
  },
]; 