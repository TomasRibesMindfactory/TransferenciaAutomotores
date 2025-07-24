import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormSubmission } from '../entities/form-submission.entity';
import { FormSubmissionRepositoryPort } from '../../domain/ports/form-submission-repository.port';

@Injectable()
export class FormSubmissionRepository implements FormSubmissionRepositoryPort {
  constructor(
    @InjectRepository(FormSubmission)
    private readonly repository: Repository<FormSubmission>,
  ) {}

  async create(submission: Partial<FormSubmission>): Promise<FormSubmission> {
    const newSubmission = this.repository.create({
      ...submission,
      submittedAt: new Date(),
    });

    return this.repository.save(newSubmission);
  }

  async findById(id: string): Promise<FormSubmission | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['form'],
    });
  }

  async findByFormId(formId: string): Promise<FormSubmission[]> {
    return this.repository.find({
      where: { formId },
      order: { submittedAt: 'DESC' },
      relations: ['form'],
    });
  }

  async updateStatus(
    id: string,
    status: string,
    responseData?: any,
  ): Promise<void> {
    const updateData: any = {
      status,
      processedAt: new Date(),
    };

    if (responseData) {
      updateData.responseData = JSON.stringify(responseData);

      if (responseData.transformedData) {
        updateData.transformedData = JSON.stringify(
          responseData.transformedData,
        );
      }

      if (responseData.error) {
        updateData.responseMessage = responseData.error;
      } else if (responseData.endpointResponse) {
        updateData.responseMessage = 'Success';
      }
    }

    await this.repository.update(id, updateData);
  }

  async findByUserId(userId: string): Promise<FormSubmission[]> {
    return this.repository.find({
      where: { userId },
      order: { submittedAt: 'DESC' },
      relations: ['form'],
    });
  }

  async getSubmissionStats(formId?: string): Promise<any> {
    const queryBuilder = this.repository.createQueryBuilder('submission');

    if (formId) {
      queryBuilder.where('submission.formId = :formId', { formId });
    }

    // Contar por status
    const statusStats = await queryBuilder
      .select('submission.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('submission.status')
      .getRawMany();

    // Total de submissions
    const total = await queryBuilder.getCount();

    // Submissions por día (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await this.repository
      .createQueryBuilder('submission')
      .select('CAST(submission.submittedAt AS DATE)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('submission.submittedAt >= :thirtyDaysAgo', { thirtyDaysAgo })
      .andWhere(
        formId ? 'submission.formId = :formId' : '1=1',
        formId ? { formId } : {},
      )
      .groupBy('CAST(submission.submittedAt AS DATE)')
      .orderBy('date', 'DESC')
      .getRawMany();

    return {
      total,
      statusStats: statusStats.reduce((acc, stat) => {
        acc[stat.status] = parseInt(stat.count);
        return acc;
      }, {}),
      dailyStats,
    };
  }
}
