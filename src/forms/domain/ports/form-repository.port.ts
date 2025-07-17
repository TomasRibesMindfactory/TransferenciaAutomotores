import { Form } from '../../infrastructure/entities/form.entity';

export interface FormListParams {
  page?: number;
  limit?: number;
  category?: string;
  isActive?: boolean;
  search?: string;
}

export interface FormListItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class FormRepositoryPort {
  abstract findAll(params?: FormListParams): Promise<FormListItem[]>;
  abstract findById(id: string): Promise<Form | null>;
  abstract findByIdWithFields(id: string): Promise<Form | null>;
  abstract create(form: Partial<Form>): Promise<Form>;
  abstract update(id: string, form: Partial<Form>): Promise<Form>;
  abstract delete(id: string): Promise<void>;
  abstract validateFormExists(id: string): Promise<boolean>;
  abstract findByCategory(category: string): Promise<FormListItem[]>;
}
