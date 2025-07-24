import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Form } from '../entities/form.entity';
import {
  FormRepositoryPort,
  FormListParams,
  FormListItem,
} from '../../domain/ports/form-repository.port';

@Injectable()
export class FormRepository implements FormRepositoryPort {
  constructor(
    @InjectRepository(Form)
    private readonly repository: Repository<Form>,
  ) {}

  async findAll(params?: FormListParams): Promise<FormListItem[]> {
    const queryBuilder = this.repository.createQueryBuilder('form');

    // Aplicar filtros
    if (params?.category) {
      queryBuilder.andWhere('form.category = :category', {
        category: params.category,
      });
    }

    if (params?.isActive !== undefined) {
      queryBuilder.andWhere('form.isActive = :isActive', {
        isActive: params.isActive,
      });
    }

    if (params?.search) {
      queryBuilder.andWhere(
        '(form.title LIKE :search OR form.description LIKE :search)',
        { search: `%${params.search}%` },
      );
    }

    // Aplicar paginación
    if (params?.page && params?.limit) {
      const offset = (params.page - 1) * params.limit;
      queryBuilder.offset(offset).limit(params.limit);
    }

    // Ordenar por fecha de actualización
    queryBuilder.orderBy('form.updatedAt', 'DESC');

    // Seleccionar solo campos necesarios para la lista
    queryBuilder.select([
      'form.id',
      'form.title',
      'form.description',
      'form.category',
      'form.isActive',
      'form.createdAt',
      'form.updatedAt',
    ]);

    const forms = await queryBuilder.getMany();

    // Mapear a FormListItem
    return forms.map((form) => ({
      id: form.id,
      title: form.title,
      description: form.description,
      category: form.category,
      isActive: form.isActive,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
    }));
  }

  async findById(id: string): Promise<Form | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByIdWithFields(id: string): Promise<Form | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['fields'],
      order: {
        fields: {
          orderIndex: 'ASC',
        },
      },
    });
  }

  async create(form: Partial<Form>): Promise<Form> {
    const newForm = this.repository.create({
      ...form,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.repository.save(newForm);
  }

  async update(id: string, form: Partial<Form>): Promise<Form> {
    await this.repository.update(id, {
      ...form,
      updatedAt: new Date(),
    });

    const updatedForm = await this.findByIdWithFields(id);
    if (!updatedForm) {
      throw new Error(`Form with ID ${id} not found after update`);
    }

    return updatedForm;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async validateFormExists(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }

  async findByCategory(category: string): Promise<FormListItem[]> {
    const forms = await this.repository.find({
      where: { category, isActive: true },
      select: [
        'id',
        'title',
        'description',
        'category',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
      order: { title: 'ASC' },
    });

    return forms.map((form) => ({
      id: form.id,
      title: form.title,
      description: form.description,
      category: form.category,
      isActive: form.isActive,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
    }));
  }
}
