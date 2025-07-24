import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  FormValidationServicePort,
  ValidationResult,
  AutoCompleteResult,
} from '../../domain/ports/form-validation-service.port';

@Injectable()
export class FormValidationService implements FormValidationServicePort {
  private readonly isDevelopment = process.env.NODE_ENV === 'development';

  constructor(private readonly httpService: HttpService) {}

  async validateField(
    endpoint: string,
    value: string,
  ): Promise<ValidationResult> {
    if (this.isDevelopment) {
      return this.simulateValidation(endpoint, value);
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${endpoint}?${this.getQueryParam(endpoint)}=${encodeURIComponent(value)}`,
        ),
      );

      return {
        isValid: response.data.exists || response.data.success,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      return {
        isValid: false,
        message: 'Error al validar el campo',
      };
    }
  }

  async getAutoCompleteData(
    endpoint: string,
    value: string,
    context?: any,
  ): Promise<AutoCompleteResult> {
    if (this.isDevelopment) {
      return this.simulateAutoComplete(endpoint, value, context);
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${endpoint}?${this.getQueryParam(endpoint)}=${encodeURIComponent(value)}`,
        ),
      );

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener datos',
      };
    }
  }

  async getDependentOptions(
    endpoint: string,
    parentValue: string,
  ): Promise<AutoCompleteResult> {
    if (this.isDevelopment) {
      return this.simulateDependentOptions(endpoint, parentValue);
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${endpoint}?parent=${encodeURIComponent(parentValue)}`,
        ),
      );

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener opciones',
      };
    }
  }

  private async simulateValidation(
    endpoint: string,
    value: string,
  ): Promise<ValidationResult> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (endpoint.includes('contribuyente')) {
      const isValid = this.isValidCuitFormat(value);
      return {
        isValid,
        message: isValid ? 'CUIT válido' : 'Formato de CUIT inválido',
        data: isValid ? this.getSimulatedContribuyenteData(value) : null,
      };
    }

    if (endpoint.includes('automotor')) {
      const isValid = this.isValidPlateFormat(value);
      return {
        isValid,
        message: isValid ? 'Patente válida' : 'Formato de patente inválido',
        data: isValid ? this.getSimulatedVehicleData(value) : null,
      };
    }

    // Validación genérica
    return {
      isValid: value.length > 0,
      message: value.length > 0 ? 'Válido' : 'Campo requerido',
    };
  }

  private async simulateAutoComplete(
    endpoint: string,
    value: string,
    context?: any,
  ): Promise<AutoCompleteResult> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (endpoint.includes('contribuyente') && this.isValidCuitFormat(value)) {
      return {
        success: true,
        data: this.getSimulatedContribuyenteData(value),
      };
    }

    if (endpoint.includes('automotor') && this.isValidPlateFormat(value)) {
      return {
        success: true,
        data: this.getSimulatedVehicleData(value),
      };
    }

    return {
      success: false,
      message: 'No se encontraron datos',
    };
  }

  private async simulateDependentOptions(
    endpoint: string,
    parentValue: string,
  ): Promise<AutoCompleteResult> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (endpoint.includes('municipio')) {
      return {
        success: true,
        data: this.getSimulatedMunicipiosPorProvincia(parentValue),
      };
    }

    if (endpoint.includes('modelo')) {
      return {
        success: true,
        data: this.getSimulatedModelosPorMarca(parentValue),
      };
    }

    return {
      success: true,
      data: [],
    };
  }

  private getQueryParam(endpoint: string): string {
    if (endpoint.includes('contribuyente')) return 'cuit';
    if (endpoint.includes('automotor')) return 'patente';
    return 'value';
  }

  private isValidCuitFormat(cuit: string): boolean {
    if (!cuit) return false;
    const cleanCuit = cuit.replace(/[-\s]/g, '');
    return /^\d{11}$/.test(cleanCuit);
  }

  private isValidPlateFormat(plate: string): boolean {
    if (!plate) return false;
    const cleanPlate = plate.replace(/\s/g, '').toUpperCase();
    return (
      /^[A-Z]{2}\d{3}[A-Z]{2}$/.test(cleanPlate) ||
      /^[A-Z]{3}\d{3}$/.test(cleanPlate)
    );
  }

  private getSimulatedContribuyenteData(cuit: string): any {
    const templates = [
      {
        nombre_completo: 'Juan Carlos Pérez',
        tipo_persona: 'Física',
        estado: 'Activo',
        domicilio: 'Av. Corrientes 1234, CABA',
        telefono: '011-4567-8901',
        email: 'juan.perez@email.com',
        fecha_inscripcion: '2018-05-15',
        categoria_fiscal: 'Responsable Inscripto',
      },
      {
        nombre_completo: 'María Elena González',
        tipo_persona: 'Física',
        estado: 'Activo',
        domicilio: 'Av. Santa Fe 5678, CABA',
        telefono: '011-9876-5432',
        email: 'maria.gonzalez@email.com',
        fecha_inscripcion: '2019-03-20',
        categoria_fiscal: 'Monotributo',
      },
      {
        nombre_completo: 'Empresa ABC S.A.',
        tipo_persona: 'Jurídica',
        estado: 'Activo',
        domicilio: 'Av. 9 de Julio 1500, CABA',
        telefono: '011-2345-6789',
        email: 'contacto@empresaabc.com',
        fecha_inscripcion: '2017-11-10',
        categoria_fiscal: 'Responsable Inscripto',
      },
    ];

    const index = cuit.charCodeAt(0) % templates.length;
    return templates[index];
  }

  private getSimulatedVehicleData(patente: string): any {
    return {
      patente,
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2020,
      color: 'Blanco',
      tipo: 'Sedan',
      combustible: 'Nafta',
      titular: 'Juan Pérez',
      estado: 'Activo',
    };
  }

  private getSimulatedMunicipiosPorProvincia(provincia: string): any[] {
    const municipios = {
      Córdoba: [
        { codigo: '001', descripcion: 'Córdoba Capital' },
        { codigo: '002', descripcion: 'Villa Carlos Paz' },
        { codigo: '003', descripcion: 'Río Cuarto' },
      ],
      'Buenos Aires': [
        { codigo: '001', descripcion: 'La Plata' },
        { codigo: '002', descripcion: 'Mar del Plata' },
        { codigo: '003', descripcion: 'Bahía Blanca' },
      ],
    };

    return municipios[provincia] || [];
  }

  private getSimulatedModelosPorMarca(marca: string): any[] {
    const modelos = {
      Toyota: [
        { codigo: '001', descripcion: 'Corolla' },
        { codigo: '002', descripcion: 'Hilux' },
        { codigo: '003', descripcion: 'Camry' },
      ],
      Ford: [
        { codigo: '001', descripcion: 'Focus' },
        { codigo: '002', descripcion: 'Ranger' },
        { codigo: '003', descripcion: 'Fiesta' },
      ],
    };

    return modelos[marca] || [];
  }
}
