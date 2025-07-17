import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjetoValorPredeterminado } from './objeto-valor-predeterminado.entity';

@Entity('AUTOMOTORES')
export class Automotor {
  @PrimaryGeneratedColumn({ name: 'ATR_ID' })
  id: number;

  @Column({ name: 'ATR_DOMINIO', length: 20, unique: true })
  dominio: string;

  @Column({ name: 'ATR_MODELO', length: 100 })
  modelo: string;

  @Column({ name: 'ATR_PCA_ID' })
  codigoAlta: number;

  @Column({ name: 'ATR_REGISTRO_ID' })
  registroId: number;

  @Column({ name: 'ATR_MARCA', length: 100 })
  marca: string;

  @Column({ name: 'ATR_FECHA_ALTA', type: 'date' })
  fechaAlta: Date;

  @Column({ name: 'ATR_FECHA_BAJA', type: 'date', nullable: true })
  fechaBaja: Date | null;

  @OneToMany(() => ObjetoValorPredeterminado, (ovp) => ovp.automotor)
  objetosValorPredeterminado: ObjetoValorPredeterminado[];
}
