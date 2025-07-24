import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Form } from './form.entity';

@Entity('form_fields')
export class FormField {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  formId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'varchar', length: 255 })
  label: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  placeholder: string;

  @Column({ type: 'bit', default: false })
  required: boolean;

  @Column({ type: 'bit', default: false })
  readonly: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  help: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  defaultValue: string;

  // Configuración específica del campo
  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  fieldConfig: string; // JSON con min, max, options, etc.

  // Configuración de validación
  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  validationConfig: string; // JSON

  // Configuración de eventos (onValidation, onChange, etc.)
  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  eventsConfig: string; // JSON

  @Column({ type: 'int', default: 0 })
  orderIndex: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  section: string;

  @CreateDateColumn({ type: 'datetime2' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Form, (form) => form.fields, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'formId' })
  form: Form;
}
