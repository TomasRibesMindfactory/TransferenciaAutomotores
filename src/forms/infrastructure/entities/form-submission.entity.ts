import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Form } from './form.entity';

@Entity('form_submissions')
export class FormSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  formId: string;

  @Column({ type: 'nvarchar', length: 'MAX' })
  data: string; // JSON con los datos enviados

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  transformedData: string; // JSON con los datos transformados

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string; // pending, processing, success, error

  @Column({ type: 'varchar', length: 500, nullable: true })
  responseMessage: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  responseData: string; // JSON con la respuesta del endpoint

  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  userId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sessionId: string;

  @CreateDateColumn({ type: 'datetime2' })
  submittedAt: Date;

  @Column({ type: 'datetime2', nullable: true })
  processedAt: Date;

  // Relaciones
  @ManyToOne(() => Form, (form) => form.submissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'formId' })
  form: Form;
}
