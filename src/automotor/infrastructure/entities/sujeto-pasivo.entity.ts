import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { VinculoSujetoObjeto } from './vinculo-sujeto-objeto.entity';

@Entity('SUJETOS_PASIVOS')
export class SujetoPasivo {
  @PrimaryGeneratedColumn({ name: 'SPO_ID' })
  id: number;

  @Column({ name: 'SPO_CUIT', length: 20 })
  cuit: string;

  @Column({ name: 'SPO_TIPO_SUJETO_PASIVO', length: 1 })
  tipoSujetoPasivo: string;

  @Column({ name: 'SPO_DENOMINACION', length: 80 })
  denominacion: string;

  @Column({ name: 'SPO_TAMANIO', length: 10, nullable: true })
  tamanio: string;

  @Column({ name: 'SPO_NUMERO_CONTRATISTA', length: 13, nullable: true })
  numeroContratista: string;

  @Column({ name: 'SPO_NUMERO_PROVEEDOR_ESTADO', length: 9, nullable: true })
  numeroProveedorEstado: string;

  @Column({ name: 'SPO_TELEFONO', length: 40, nullable: true })
  telefono: string;

  @Column({ name: 'SPO_FAX', length: 40, nullable: true })
  fax: string;

  @Column({ name: 'SPO_CORREO_ELECTRONICO', length: 40, nullable: true })
  correoElectronico: string;

  @Column({ name: 'SPO_CONDICION_DGI', length: 40, nullable: true })
  condicionDgi: string;

  @Column({ name: 'SPO_FECHA_INICIO', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'SPO_FECHA_FIN', type: 'date', nullable: true })
  fechaFin: Date;

  @Column({ name: 'SPO_FECHA_INSCRIP_REGISTRO', type: 'date', nullable: true })
  fechaInscripRegistro: Date;

  @Column({ name: 'SPO_NUMERO_INSCRIP_REGISTRO', length: 13, nullable: true })
  numeroInscripRegistro: string;

  @Column({ name: 'SPO_NOMBRE_FANTASIA', length: 40, nullable: true })
  nombreFantasia: string;

  @Column({ name: 'SPO_CANTIDAD_SUCURSALES', type: 'int', nullable: true })
  cantidadSucursales: number;

  @Column({ name: 'SPO_CANTIDAD_PERSONAL_PERMAN', type: 'int', nullable: true })
  cantidadPersonalPerman: number;

  @Column({ name: 'SPO_CANTIDAD_PERSONAL_TRANSI', type: 'int', nullable: true })
  cantidadPersonalTransi: number;

  @Column({ name: 'SPO_LUGAR_FALLECIMIENTO', length: 40, nullable: true })
  lugarFallecimiento: string;

  @Column({ name: 'SPO_FECHA_FALLECIMIENTO', type: 'date', nullable: true })
  fechaFallecimiento: Date;

  @Column({ name: 'SPO_NUMERO_AUTOS', length: 13, nullable: true })
  numeroAutos: string;

  @Column({ name: 'SPO_CARATULA_EXPEDIENTE', length: 13, nullable: true })
  caratulaExpediente: string;

  @Column({ name: 'SPO_TIPO_JUZGADO', length: 5, nullable: true })
  tipoJuzgado: string;

  @Column({ name: 'SPO_NUMERO_JUZGADO', length: 13, nullable: true })
  numeroJuzgado: string;

  @Column({ name: 'SPO_SECRETARIA', length: 13, nullable: true })
  secretaria: string;

  @Column({ name: 'SPO_OBSERVACIONES', length: 2000, nullable: true })
  observaciones: string;

  @Column({ name: 'SPO_PRC_PTC_PSC_PPC_ID', length: 5, nullable: true })
  prcPtcPscPpcId: string;

  @Column({ name: 'SPO_PRC_PTC_PSC_ID', length: 5, nullable: true })
  prcPtcPscId: string;

  @Column({ name: 'SPO_PRC_PTC_ID', length: 5, nullable: true })
  prcPtcId: string;

  @Column({ name: 'SPO_PRC_ID', length: 5, nullable: true })
  prcId: string;

  @Column({ name: 'SPO_USUARIO_ALTA', length: 10 })
  usuarioAlta: string;

  @Column({ name: 'SPO_FECHA_ALTA', type: 'date' })
  fechaAlta: Date;

  @Column({ name: 'SPO_USUARIO_ULT_MOD', length: 10, nullable: true })
  usuarioUltMod: string;

  @Column({ name: 'SPO_FECHA_ULT_MOD', type: 'date', nullable: true })
  fechaUltMod: Date;

  @Column({ name: 'SPO_USUARIO_BAJA', length: 10, nullable: true })
  usuarioBaja: string;

  @Column({ name: 'SPO_FECHA_BAJA', type: 'date', nullable: true })
  fechaBaja: Date;

  @Column({ name: 'SPO_PCJ_ID', length: 5, nullable: true })
  pcjId: string;

  @Column({ name: 'SPO_PCJ_PTB_ID', length: 5, nullable: true })
  pcjPtbId: string;

  @Column({ name: 'SPO_PCA_ID', length: 5 })
  pcaId: string;

  @Column({ name: 'SPO_PCA_PTA_ID', length: 5 })
  pcaPtaId: string;

  @OneToMany(() => VinculoSujetoObjeto, (vso) => vso.sujetoPasivo)
  vinculos: VinculoSujetoObjeto[];
}
