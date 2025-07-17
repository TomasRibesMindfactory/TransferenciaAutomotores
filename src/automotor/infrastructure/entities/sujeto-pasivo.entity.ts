import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { VinculoSujetoObjeto } from './vinculo-sujeto-objeto.entity';

@Entity('SUJETOS_PASIVOS')
export class SujetoPasivo {
  @PrimaryGeneratedColumn({ name: 'SPO_ID' })
  id: number;

  @Column({ name: 'SPO_CUIT', length: 13, unique: true })
  cuit: string;

  @Column({ name: 'SPO_RAZSOC', length: 200 })
  razonSocial: string;

  @Column({ name: 'SPO_FECHA_ALTA', type: 'date' })
  fechaAlta: Date;

  @Column({ name: 'SPO_FECHA_BAJA', type: 'date', nullable: true })
  fechaBaja: Date | null;

  @OneToMany(() => VinculoSujetoObjeto, vso => vso.sujetoPasivo)
  vinculos: VinculoSujetoObjeto[];
} 