export interface ValidationResult {
  isValid: boolean;
  message?: string;
  data?: any;
}

export interface AutoCompleteResult {
  success: boolean;
  data?: any;
  message?: string;
}

export abstract class FormValidationServicePort {
  abstract validateField(
    endpoint: string,
    value: string,
  ): Promise<ValidationResult>;
  abstract getAutoCompleteData(
    endpoint: string,
    value: string,
    context?: any,
  ): Promise<AutoCompleteResult>;
  abstract getDependentOptions(
    endpoint: string,
    parentValue: string,
  ): Promise<AutoCompleteResult>;
}
