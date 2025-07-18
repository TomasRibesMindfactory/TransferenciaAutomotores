import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SujetoPasivo } from './sujeto-pasivo.entity';
import { ObjetoValorPredeterminado } from './objeto-valor-predeterminado.entity';

@Entity('TRANSFERENCIAS')
export class Transferencia {
  @PrimaryGeneratedColumn({ name: 'TFA_ID' })
  id: number;

  @Column({ name: 'TFA_OVP_OVP_ID' })
  ovpOvpId: number;

  @Column({ name: 'TFA_SPO_ID', type: 'bigint' })
  spoId: number;

  @Column({ name: 'TFA_SPO_ID_NUEVO_DUENO', type: 'bigint' })
  spoIdNuevoDueno: number;

  @Column({ name: 'TFA_FECHA_TRANSFERENCIA', type: 'date' })
  fechaTransferencia: Date;

  @Column({ name: 'TFA_PMA_ID', length: 5 })
  pmaId: string;

  @Column({
    name: 'TFA_IMPORTE_SELLOS',
    type: 'decimal',
    precision: 24,
    scale: 3,
    nullable: true,
  })
  importeSellos: number;

  @Column({
    name: 'TFA_IMPORTE_TRANSFERENCIA',
    type: 'decimal',
    precision: 24,
    scale: 3,
    nullable: true,
  })
  importeTransferencia: number;

  @Column({ name: 'TFA_USUARIO_ALTA', length: 10 })
  usuarioAlta: string;

  @Column({ name: 'TFA_FECHA_ALTA', type: 'date' })
  fechaAlta: Date;

  @Column({ name: 'TFA_USUARIO_ULT_MOD', length: 10, nullable: true })
  usuarioUltMod: string;

  @Column({ name: 'TFA_FECHA_ULT_MOD', type: 'date', nullable: true })
  fechaUltMod: Date;

  @Column({ name: 'TFA_USUARIO_BAJA', length: 10, nullable: true })
  usuarioBaja: string;

  @Column({ name: 'TFA_FECHA_BAJA', type: 'date', nullable: true })
  fechaBaja: Date;

  @Column({ name: 'TFA_ATR_DOMINIO', length: 8 })
  atrDominio: string;

  @Column({ name: 'TFA_ATR_PTH_ID', length: 5 })
  atrPthId: string;

  @ManyToOne(() => SujetoPasivo)
  @JoinColumn({ name: 'TFA_SPO_ID' })
  sujetoPasivoActual: SujetoPasivo;

  @ManyToOne(() => SujetoPasivo)
  @JoinColumn({ name: 'TFA_SPO_ID_NUEVO_DUENO' })
  sujetoPasivoNuevo: SujetoPasivo;

  @ManyToOne(() => ObjetoValorPredeterminado)
  @JoinColumn({ name: 'TFA_OVP_OVP_ID' })
  objetoValorPredeterminado: ObjetoValorPredeterminado;
}
