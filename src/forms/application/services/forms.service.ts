import { Injectable } from '@nestjs/common';
import {
  FormRepositoryPort,
  FormListParams,
  FormListItem,
} from '../../domain/ports/form-repository.port';
import { Form } from '../../infrastructure/entities/form.entity';

@Injectable()
export class FormsService {
  constructor(private readonly formRepository: FormRepositoryPort) {}

  async getForms(params?: FormListParams): Promise<FormListItem[]> {
    return this.formRepository.findAll(params);
  }

  async getForm(formId: string): Promise<Form | null> {
    const form = await this.formRepository.findByIdWithFields(formId);

    if (!form) {
      return null;
    }

    // Procesar configuraciones JSON
    return this.processFormConfiguration(form);
  }

  async validateFormExists(formId: string): Promise<boolean> {
    return this.formRepository.validateFormExists(formId);
  }

  async getFormsByCategory(category: string): Promise<FormListItem[]> {
    return this.formRepository.findByCategory(category);
  }

  async createForm(formData: Partial<Form>): Promise<Form> {
    // Validar datos del formulario
    this.validateFormData(formData);

    return this.formRepository.create(formData);
  }

  async updateForm(formId: string, formData: Partial<Form>): Promise<Form> {
    // Verificar que el formulario existe
    const exists = await this.formRepository.validateFormExists(formId);
    if (!exists) {
      throw new Error(`Form with ID ${formId} not found`);
    }

    // Validar datos del formulario
    this.validateFormData(formData);

    return this.formRepository.update(formId, formData);
  }

  async deleteForm(formId: string): Promise<void> {
    const exists = await this.formRepository.validateFormExists(formId);
    if (!exists) {
      throw new Error(`Form with ID ${formId} not found`);
    }

    await this.formRepository.delete(formId);
  }

  private processFormConfiguration(form: Form): Form {
    try {
      // Procesar configuraciones JSON almacenadas como strings
      const processedForm = { ...form };

      if (form.buttonsConfig) {
        processedForm.buttonsConfig = JSON.parse(form.buttonsConfig);
      }

      if (form.layoutConfig) {
        processedForm.layoutConfig = JSON.parse(form.layoutConfig);
      }

      if (form.submissionSchema) {
        processedForm.submissionSchema = JSON.parse(form.submissionSchema);
      }

      if (form.validationRules) {
        processedForm.validationRules = JSON.parse(form.validationRules);
      }

      if (form.validationConstraints) {
        processedForm.validationConstraints = JSON.parse(
          form.validationConstraints,
        );
      }

      if (form.eventsConfig) {
        processedForm.eventsConfig = JSON.parse(form.eventsConfig);
      }

      if (form.sectionsConfig) {
        processedForm.sectionsConfig = JSON.parse(form.sectionsConfig);
      }

      // Procesar campos
      if (form.fields) {
        processedForm.fields = form.fields.map((field) => {
          const processedField = { ...field };

          if (field.fieldConfig) {
            processedField.fieldConfig = JSON.parse(field.fieldConfig);
          }

          if (field.validationConfig) {
            processedField.validationConfig = JSON.parse(
              field.validationConfig,
            );
          }

          if (field.eventsConfig) {
            processedField.eventsConfig = JSON.parse(field.eventsConfig);
          }

          return processedField;
        });
      }

      return processedForm;
    } catch (error) {
      throw new Error(`Error processing form configuration: ${error.message}`);
    }
  }

  private validateFormData(formData: Partial<Form>): void {
    if (formData.id && !this.isValidFormId(formData.id)) {
      throw new Error('Invalid form ID format');
    }

    if (formData.title && formData.title.trim().length === 0) {
      throw new Error('Form title cannot be empty');
    }

    if (formData.category && formData.category.trim().length === 0) {
      throw new Error('Form category cannot be empty');
    }

    // Validar JSON configurations si están presentes
    try {
      if (
        formData.buttonsConfig &&
        typeof formData.buttonsConfig === 'string'
      ) {
        JSON.parse(formData.buttonsConfig);
      }

      if (formData.layoutConfig && typeof formData.layoutConfig === 'string') {
        JSON.parse(formData.layoutConfig);
      }

      if (
        formData.submissionSchema &&
        typeof formData.submissionSchema === 'string'
      ) {
        JSON.parse(formData.submissionSchema);
      }
    } catch (error) {
      throw new Error(`Invalid JSON configuration: ${error.message}`);
    }
  }

  private isValidFormId(id: string): boolean {
    // Validar formato del ID del formulario (letras, números, guiones)
    const idRegex = /^[a-z0-9-]+$/;
    return idRegex.test(id) && id.length <= 100;
  }
}
