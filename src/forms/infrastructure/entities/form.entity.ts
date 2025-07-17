import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { FormField } from './form-field.entity';
import { FormSubmission } from './form-submission.entity';

@Entity('forms')
export class Form {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  subtitle: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'bit', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  version: string;

  // Configuración de botones
  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  buttonsConfig: string; // JSON

  // Configuración de layout
  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  layoutConfig: string; // JSON

  // Configuración de envío
  @Column({ type: 'varchar', length: 500, nullable: true })
  submissionEndpoint: string;

  @Column({ type: 'varchar', length: 10, default: 'POST' })
  submissionMethod: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  submissionSchema: string; // JSON

  // Configuración de validaciones
  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  validationRules: string; // JSON

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  validationConstraints: string; // JSON

  // Configuración de eventos
  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  eventsConfig: string; // JSON

  // Secciones del formulario
  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  sectionsConfig: string; // JSON

  @CreateDateColumn({ type: 'datetime2' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  createdBy: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  updatedBy: string;

  // Relaciones
  @OneToMany(() => FormField, (field) => field.form, { cascade: true })
  fields: FormField[];

  @OneToMany(() => FormSubmission, (submission) => submission.form)
  submissions: FormSubmission[];
}
