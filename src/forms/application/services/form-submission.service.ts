import { Injectable } from '@nestjs/common';
import {
  FormSubmissionRepositoryPort,
  SubmissionData,
  SubmissionResponse,
} from '../../domain/ports/form-submission-repository.port';
import { FormValidationServicePort } from '../../domain/ports/form-validation-service.port';
import { FormsService } from './forms.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FormSubmissionService {
  constructor(
    private readonly submissionRepository: FormSubmissionRepositoryPort,
    private readonly validationService: FormValidationServicePort,
    private readonly formsService: FormsService,
    private readonly httpService: HttpService,
  ) {}

  async submitForm(
    submissionData: SubmissionData,
  ): Promise<SubmissionResponse> {
    // 1. Validar que el formulario existe
    const form = await this.formsService.getForm(submissionData.formId);
    if (!form) {
      throw new Error(`Form with ID ${submissionData.formId} not found`);
    }

    // 2. Crear registro de submission
    const submission = await this.submissionRepository.create({
      formId: submissionData.formId,
      data: JSON.stringify(submissionData.data),
      status: 'pending',
      userAgent: submissionData.userAgent,
      ipAddress: submissionData.ipAddress,
      userId: submissionData.userId,
      sessionId: submissionData.sessionId,
      submittedAt: new Date(),
    });

    try {
      // 3. Transformar datos según el schema del formulario
      const transformedData = await this.transformSubmissionData(
        form,
        submissionData.data,
      );

      // 4. Actualizar submission con datos transformados
      await this.submissionRepository.updateStatus(
        submission.id,
        'processing',
        { transformedData },
      );

      // 5. Enviar al endpoint configurado
      const response = await this.sendToEndpoint(form, transformedData);

      // 6. Actualizar estado final
      await this.submissionRepository.updateStatus(submission.id, 'success', {
        transformedData,
        endpointResponse: response,
      });

      return {
        success: true,
        message: 'Form submitted successfully',
        data: response,
        submissionId: submission.id,
      };
    } catch (error) {
      // Marcar como error
      await this.submissionRepository.updateStatus(submission.id, 'error', {
        error: error.message,
        stack: error.stack,
      });

      throw new Error(`Form submission failed: ${error.message}`);
    }
  }

  async getSubmission(submissionId: string) {
    return this.submissionRepository.findById(submissionId);
  }

  async getSubmissionsByForm(formId: string) {
    return this.submissionRepository.findByFormId(formId);
  }

  async getSubmissionsByUser(userId: string) {
    return this.submissionRepository.findByUserId(userId);
  }

  async getSubmissionStats(formId?: string) {
    return this.submissionRepository.getSubmissionStats(formId);
  }

  private async transformSubmissionData(form: any, data: any): Promise<any> {
    // Implementar transformación según el schema del formulario
    if (!form.submissionSchema) {
      return data;
    }

    const schema =
      typeof form.submissionSchema === 'string'
        ? JSON.parse(form.submissionSchema)
        : form.submissionSchema;

    return this.applySchemaTransformation(data, schema);
  }

  private applySchemaTransformation(data: any, schema: any): any {
    if (schema.type === 'object' && schema.mapping) {
      const result: any = {};

      for (const [key, property] of Object.entries(schema.mapping)) {
        const value = this.transformProperty(data, property as any);
        if (value !== undefined) {
          result[key] = value;
        }
      }

      return result;
    }

    return data;
  }

  private transformProperty(data: any, property: any): any {
    let value: any;

    // Obtener valor desde el source
    if (property.source) {
      value = this.getNestedValue(data, property.source);
    } else {
      value = data;
    }

    if (value === undefined || value === null) {
      return undefined;
    }

    // Aplicar transformación customizada si existe
    if (property.transform && typeof property.transform === 'function') {
      value = property.transform(value);
    }

    // Convertir tipo si es necesario
    value = this.convertType(value, property.type);

    // Transformación recursiva para objetos y arrays
    if (property.type === 'object' && property.mapping) {
      return this.applySchemaTransformation(value, {
        type: 'object',
        mapping: property.mapping,
      });
    }

    if (property.type === 'array' && property.items) {
      if (Array.isArray(value)) {
        return value.map((item) =>
          this.transformProperty(item, property.items),
        );
      }
      return [];
    }

    return value;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  private convertType(value: any, type?: string): any {
    if (type === undefined || value === undefined || value === null) {
      return value;
    }

    switch (type) {
      case 'string':
        return String(value);

      case 'number':
        const num = Number(value);
        return isNaN(num) ? undefined : num;

      case 'boolean':
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
          const lower = value.toLowerCase();
          if (
            lower === 'true' ||
            lower === 's' ||
            lower === 'si' ||
            lower === 'yes'
          )
            return true;
          if (lower === 'false' || lower === 'n' || lower === 'no')
            return false;
        }
        return Boolean(value);

      case 'date':
        if (value instanceof Date) return value.toISOString().split('T')[0];
        if (typeof value === 'string') {
          const date = new Date(value);
          return isNaN(date.getTime())
            ? undefined
            : date.toISOString().split('T')[0];
        }
        return undefined;

      case 'datetime':
        if (value instanceof Date) return value.toISOString();
        if (typeof value === 'string') {
          const date = new Date(value);
          return isNaN(date.getTime()) ? undefined : date.toISOString();
        }
        return undefined;

      case 'array':
        return Array.isArray(value) ? value : [value];

      case 'object':
        return typeof value === 'object' ? value : {};

      default:
        return value;
    }
  }

  private async sendToEndpoint(form: any, data: any): Promise<any> {
    if (!form.submissionEndpoint) {
      throw new Error('No submission endpoint configured for this form');
    }

    const method = form.submissionMethod || 'POST';
    const endpoint = form.submissionEndpoint;

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url: endpoint,
          data,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          timeout: 30000, // 30 segundos timeout
        }),
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          `Endpoint returned ${error.response.status}: ${error.response.data?.message || error.response.statusText}`,
        );
      } else if (error.request) {
        throw new Error('No response received from endpoint');
      } else {
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  }
}
