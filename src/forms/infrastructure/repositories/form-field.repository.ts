import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormField } from '../entities/form-field.entity';
import { FormFieldRepositoryPort } from '../../domain/ports/form-field-repository.port';

@Injectable()
export class FormFieldRepository implements FormFieldRepositoryPort {
  constructor(
    @InjectRepository(FormField)
    private readonly formFieldRepository: Repository<FormField>,
  ) {}

  async create(formField: Partial<FormField>): Promise<FormField> {
    const newFormField = this.formFieldRepository.create(formField);
    return this.formFieldRepository.save(newFormField);
  }

  async findByFormId(formId: string): Promise<FormField[]> {
    return this.formFieldRepository.find({
      where: { formId },
      order: { orderIndex: 'ASC' },
    });
  }

  async findById(id: string): Promise<FormField | null> {
    return this.formFieldRepository.findOne({ where: { id } });
  }

  async update(id: string, formField: Partial<FormField>): Promise<FormField> {
    await this.formFieldRepository.update(id, formField);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.formFieldRepository.delete(id);
  }

  async findAll(): Promise<FormField[]> {
    return this.formFieldRepository.find({
      order: { orderIndex: 'ASC' },
    });
  }
}
