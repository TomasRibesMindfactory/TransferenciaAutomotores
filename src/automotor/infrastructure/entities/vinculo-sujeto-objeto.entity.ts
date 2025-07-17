import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SujetoPasivo } from './sujeto-pasivo.entity';
import { ObjetoValorPredeterminado } from './objeto-valor-predeterminado.entity';

@Entity('VINCULOS_SUJETO_OBJETO')
export class VinculoSujetoObjeto {
  @PrimaryGeneratedColumn({ name: 'VSO_ID' })
  id: number;

  @Column({ name: 'VSO_SPO_ID' })
  sujetoPasivoId: number;

  @Column({ name: 'VSO_OVP_ID' })
  objetoValorPredeterminadoId: number;

  @Column({ name: 'VSO_FECHA_INICIO', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'VSO_FECHA_HASTA', type: 'date', nullable: true })
  fechaHasta: Date | null;

  @Column({ name: 'VSO_FECHA_BAJA', type: 'date', nullable: true })
  fechaBaja: Date | null;

  @Column({ name: 'VSO_PORCENTAJE', type: 'decimal', precision: 5, scale: 2 })
  porcentaje: number;

  @Column({ name: 'VSO_RESPONSABLE', length: 1 })
  responsable: string; // 'S' o 'N'

  @ManyToOne(() => SujetoPasivo, sujetoPasivo => sujetoPasivo.vinculos)
  @JoinColumn({ name: 'VSO_SPO_ID' })
  sujetoPasivo: SujetoPasivo;

  @ManyToOne(() => ObjetoValorPredeterminado, ovp => ovp.vinculos)
  @JoinColumn({ name: 'VSO_OVP_ID' })
  objetoValorPredeterminado: ObjetoValorPredeterminado;
} 