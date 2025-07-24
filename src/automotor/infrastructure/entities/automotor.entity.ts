import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjetoValorPredeterminado } from './objeto-valor-predeterminado.entity';

@Entity('AUTOMOTORES')
export class Automotor {
  @PrimaryGeneratedColumn({ name: 'ATR_ID' })
  id: number;

  @Column({ name: 'ATR_FECHA_INICIO', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'ATR_DOMINIO', length: 8 })
  dominio: string;

  @Column({ name: 'ATR_NUMERO_CHASIS', length: 25, nullable: true })
  numeroChasis: string;

  @Column({ name: 'ATR_NUMERO_MOTOR', length: 25, nullable: true })
  numeroMotor: string;

  @Column({ name: 'ATR_CARROCERIA', length: 13, nullable: true })
  carroceria: string;

  @Column({ name: 'ATR_COLOR', length: 40, nullable: true })
  color: string;

  @Column({ name: 'ATR_FECHA_FABRICACION', type: 'int' })
  fechaFabricacion: number;

  @Column({ name: 'ATR_FECHA_RIGE', type: 'date' })
  fechaRige: Date;

  @Column({ name: 'ATR_FECHA_ALTA_REGISTRO', type: 'date', nullable: true })
  fechaAltaRegistro: Date;

  @Column({ name: 'ATR_FECHA_BAJA_REGISTRO', type: 'date', nullable: true })
  fechaBajaRegistro: Date;

  @Column({ name: 'ATR_NUMERO_EXPEDIENTE_BAJA', length: 10, nullable: true })
  numeroExpedienteBaja: string;

  @Column({ name: 'ATR_PPA_ID', length: 5, nullable: true })
  ppaId: string;

  @Column({ name: 'ATR_PMO_ID', length: 15, nullable: true })
  pmoId: string;

  @Column({ name: 'ATR_PPA_PPS_ID', length: 5, nullable: true })
  ppaPpsId: string;

  @Column({ name: 'ATR_PRT_ID', length: 5, nullable: true })
  prtId: string;

  @Column({ name: 'ATR_PCE_ID', length: 5, nullable: true })
  pceId: string;

  @Column({ name: 'ATR_PCA_PTA_ID', length: 5 })
  pcaPtaId: string;

  @Column({ name: 'ATR_PCA_ID', length: 5 })
  pcaId: string;

  @Column({ name: 'ATR_PCJ_PTB_ID', length: 5, nullable: true })
  pcjPtbId: string;

  @Column({ name: 'ATR_PCJ_ID', length: 5, nullable: true })
  pcjId: string;

  @Column({ name: 'ATR_USUARIO_ALTA', length: 10 })
  usuarioAlta: string;

  @Column({ name: 'ATR_FECHA_ALTA', type: 'date' })
  fechaAlta: Date;

  @Column({ name: 'ATR_USUARIO_ULT_MOD', length: 10, nullable: true })
  usuarioUltMod: string;

  @Column({ name: 'ATR_FECHA_FIN', type: 'date', nullable: true })
  fechaFin: Date;

  @Column({ name: 'ATR_FECHA_ULT_MOD', type: 'date', nullable: true })
  fechaUltMod: Date;

  @Column({ name: 'ATR_USUARIO_BAJA', length: 10, nullable: true })
  usuarioBaja: string;

  @Column({ name: 'ATR_FECHA_BAJA', type: 'date', nullable: true })
  fechaBaja: Date;

  @Column({ name: 'ATR_PPS_ID', length: 5, nullable: true })
  ppsId: string;

  @Column({ name: 'ATR_PUO_ID', length: 5, nullable: true })
  puoId: string;

  @Column({ name: 'ATR_PTH_ID', length: 5 })
  pthId: string;

  @Column({ name: 'ATR_MODELO_ANIO', type: 'int', nullable: true })
  modeloAnio: number;

  @Column({ name: 'ATR_DOMINIO_VIEJO', length: 13, nullable: true })
  dominioViejo: string;

  @Column({ name: 'ATR_FECHA_VIGENCIA_AFORO', type: 'date', nullable: true })
  fechaVigenciaAforo: Date;

  @Column({ name: 'ATR_PRM_ID', length: 3, nullable: true })
  prmId: string;

  @Column({ name: 'ATR_MEDIDA', type: 'int', nullable: true })
  medida: number;

  @Column({ name: 'ATR_ID_MARCA_RNPA', length: 10, nullable: true })
  idMarcaRnpa: string;

  @Column({ name: 'ATR_ID_TIPO_RNPA', length: 8, nullable: true })
  idTipoRnpa: string;

  @Column({ name: 'ATR_ID_MODELO_RNPA', length: 12, nullable: true })
  idModeloRnpa: string;

  @Column({ name: 'ATR_ORIGEN_RNPA', length: 1, nullable: true })
  origenRnpa: string;

  @Column({ name: 'ATR_OBSERVACIONES', length: 240, nullable: true })
  observaciones: string;

  @OneToMany(() => ObjetoValorPredeterminado, (ovp) => ovp.automotor)
  objetosValorPredeterminado: ObjetoValorPredeterminado[];
}
