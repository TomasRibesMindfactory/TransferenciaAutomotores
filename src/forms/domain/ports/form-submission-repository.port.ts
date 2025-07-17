import { FormSubmission } from '../../infrastructure/entities/form-submission.entity';

export interface SubmissionData {
  formId: string;
  data: any;
  userAgent?: string;
  ipAddress?: string;
  userId?: string;
  sessionId?: string;
}

export interface SubmissionResponse {
  success: boolean;
  message?: string;
  data?: any;
  submissionId: string;
}

export abstract class FormSubmissionRepositoryPort {
  abstract create(submission: Partial<FormSubmission>): Promise<FormSubmission>;
  abstract findById(id: string): Promise<FormSubmission | null>;
  abstract findByFormId(formId: string): Promise<FormSubmission[]>;
  abstract updateStatus(
    id: string,
    status: string,
    responseData?: any,
  ): Promise<void>;
  abstract findByUserId(userId: string): Promise<FormSubmission[]>;
  abstract getSubmissionStats(formId?: string): Promise<any>;
}
