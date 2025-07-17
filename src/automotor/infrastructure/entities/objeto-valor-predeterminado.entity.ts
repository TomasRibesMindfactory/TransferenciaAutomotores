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

  @Column({ name: 'OVP_ATR_ID' })
  automotorId: number;

  @Column({ name: 'OVP_FECHA_VIGENCIA', type: 'date' })
  fechaVigencia: Date;

  @Column({ name: 'OVP_VALOR', type: 'decimal', precision: 15, scale: 2 })
  valor: number;

  @ManyToOne(
    () => Automotor,
    (automotor) => automotor.objetosValorPredeterminado,
  )
  @JoinColumn({ name: 'OVP_ATR_ID' })
  automotor: Automotor;

  @OneToMany(() => VinculoSujetoObjeto, (vso) => vso.objetoValorPredeterminado)
  vinculos: VinculoSujetoObjeto[];
}
