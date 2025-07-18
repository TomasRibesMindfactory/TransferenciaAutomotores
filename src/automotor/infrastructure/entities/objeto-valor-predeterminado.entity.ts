import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Automotor } from './automotor.entity';
import { VinculoSujetoObjeto } from './vinculo-sujeto-objeto.entity';

@Entity('OBJETOS_VALOR_PREDETERMINADO')
export class ObjetoValorPredeterminado {
  @PrimaryGeneratedColumn({ name: 'OVP_ID' })
  id: number;

  @Column({ name: 'OVP_FECHA_INICIO', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'OVP_TIPO', length: 1 })
  tipo: string;

  @Column({ name: 'OVP_FECHA_FIN', type: 'date', nullable: true })
  fechaFin: Date;

  @Column({ name: 'OVP_IME_PARTIDA_INMOBILIARIA', length: 21, nullable: true })
  imePartidaInmobiliaria: string;

  @Column({ name: 'OVP_ATR_DOMINIO', length: 8, nullable: true })
  atrDominio: string;

  @Column({ name: 'OVP_TLO_NRO_CONSOLIDACION', type: 'bigint', nullable: true })
  tloNroConsolidacion: number;

  @Column({ name: 'OVP_ATR_PTH_ID', length: 5, nullable: true })
  atrPthId: string;

  @Column({ name: 'OVP_PUO_ID', length: 5, nullable: true })
  puoId: string;

  @Column({ name: 'OVP_USUARIO_ALTA', length: 10 })
  usuarioAlta: string;

  @Column({ name: 'OVP_FECHA_ALTA', type: 'date' })
  fechaAlta: Date;

  @Column({ name: 'OVP_USUARIO_ULT_MOD', length: 10, nullable: true })
  usuarioUltMod: string;

  @Column({ name: 'OVP_FECHA_ULT_MOD', type: 'date', nullable: true })
  fechaUltMod: Date;

  @Column({ name: 'OVP_USUARIO_BAJA', length: 10, nullable: true })
  usuarioBaja: string;

  @Column({ name: 'OVP_FECHA_BAJA', type: 'date', nullable: true })
  fechaBaja: Date;

  @Column({ name: 'OVP_ATR_ID', type: 'int', nullable: true })
  atrId: number;

  @ManyToOne(
    () => Automotor,
    (automotor) => automotor.objetosValorPredeterminado,
  )
  @JoinColumn({ name: 'OVP_ATR_ID' })
  automotor: Automotor;

  @OneToMany(() => VinculoSujetoObjeto, (vso) => vso.objetoValorPredeterminado)
  vinculos: VinculoSujetoObjeto[];
}
