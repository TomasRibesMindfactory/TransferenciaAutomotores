import { FormField } from '../../infrastructure/entities/form-field.entity';

export abstract class FormFieldRepositoryPort {
  abstract create(formField: Partial<FormField>): Promise<FormField>;
  abstract findByFormId(formId: string): Promise<FormField[]>;
  abstract findById(id: string): Promise<FormField | null>;
  abstract update(
    id: string,
    formField: Partial<FormField>,
  ): Promise<FormField>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<FormField[]>;
}
