import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

// Entities
import { Form } from './infrastructure/entities/form.entity';
import { FormField } from './infrastructure/entities/form-field.entity';
import { FormSubmission } from './infrastructure/entities/form-submission.entity';

// Controllers
import { FormsController } from './infrastructure/controllers/forms.controller';

// Services (Application Layer)
import { FormsService } from './application/services/forms.service';
import { FormSubmissionService } from './application/services/form-submission.service';

// Repositories (Infrastructure Layer)
import { FormRepository } from './infrastructure/repositories/form.repository';
import { FormFieldRepository } from './infrastructure/repositories/form-field.repository';
import { FormSubmissionRepository } from './infrastructure/repositories/form-submission.repository';

// Services (Infrastructure Layer)
import { FormValidationService } from './infrastructure/services/form-validation.service';
import { FormSeedService } from './infrastructure/services/form-seed.service';
import { FormFieldSeedService } from './infrastructure/services/form-field-seed.service';

// Ports (Domain Layer)
import { FormRepositoryPort } from './domain/ports/form-repository.port';
import { FormFieldRepositoryPort } from './domain/ports/form-field-repository.port';
import { FormSubmissionRepositoryPort } from './domain/ports/form-submission-repository.port';
import { FormValidationServicePort } from './domain/ports/form-validation-service.port';

@Module({
  imports: [
    TypeOrmModule.forFeature([Form, FormField, FormSubmission]),
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
  ],
  controllers: [FormsController],
  providers: [
    // Application Services
    FormsService,
    FormSubmissionService,

    // Infrastructure Repositories (implementing domain ports)
    {
      provide: FormRepositoryPort,
      useClass: FormRepository,
    },
    {
      provide: FormFieldRepositoryPort,
      useClass: FormFieldRepository,
    },
    {
      provide: FormSubmissionRepositoryPort,
      useClass: FormSubmissionRepository,
    },

    // Infrastructure Services (implementing domain ports)
    {
      provide: FormValidationServicePort,
      useClass: FormValidationService,
    },

    // Direct service providers for injection
    FormRepository,
    FormFieldRepository,
    FormSubmissionRepository,
    FormValidationService,
    FormSeedService,
    FormFieldSeedService,
  ],
  exports: [
    FormsService,
    FormSubmissionService,
    FormValidationService,
    FormSeedService,
    FormFieldSeedService,
    FormRepositoryPort,
    FormFieldRepositoryPort,
    FormSubmissionRepositoryPort,
    FormValidationServicePort,
  ],
})
export class FormsModule {}
