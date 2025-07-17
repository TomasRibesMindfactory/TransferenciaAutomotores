import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { FormsService } from '../../application/services/forms.service';
import { FormSubmissionService } from '../../application/services/form-submission.service';
import { FormValidationService } from '../services/form-validation.service';
import { FormListParams } from '../../domain/ports/form-repository.port';
import { SubmissionData } from '../../domain/ports/form-submission-repository.port';

@ApiTags('forms')
@Controller('forms')
export class FormsController {
  constructor(
    private readonly formsService: FormsService,
    private readonly submissionService: FormSubmissionService,
    private readonly validationService: FormValidationService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de formularios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de formularios obtenida exitosamente',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  async getForms(@Query() query: any) {
    try {
      const params: FormListParams = {
        page: query.page ? parseInt(query.page) : undefined,
        limit: query.limit ? parseInt(query.limit) : undefined,
        category: query.category,
        isActive:
          query.isActive !== undefined ? query.isActive === 'true' : undefined,
        search: query.search,
      };

      return await this.formsService.getForms(params);
    } catch (error) {
      throw new HttpException(
        `Error al obtener formularios: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener formulario por ID' })
  @ApiParam({ name: 'id', description: 'ID del formulario' })
  @ApiResponse({ status: 200, description: 'Formulario encontrado' })
  @ApiResponse({ status: 404, description: 'Formulario no encontrado' })
  async getForm(@Param('id') id: string) {
    try {
      const form = await this.formsService.getForm(id);

      if (!form) {
        throw new HttpException(
          `Formulario con ID ${id} no encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }

      return form;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error al obtener formulario: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Obtener formularios por categoría' })
  @ApiParam({ name: 'category', description: 'Categoría de formularios' })
  @ApiResponse({
    status: 200,
    description: 'Formularios de la categoría obtenidos',
  })
  async getFormsByCategory(@Param('category') category: string) {
    try {
      return await this.formsService.getFormsByCategory(category);
    } catch (error) {
      throw new HttpException(
        `Error al obtener formularios por categoría: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Enviar formulario' })
  @ApiParam({ name: 'id', description: 'ID del formulario' })
  @ApiResponse({ status: 201, description: 'Formulario enviado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Formulario no encontrado' })
  async submitForm(@Param('id') formId: string, @Body() body: any) {
    try {
      const submissionData: SubmissionData = {
        formId,
        data: body,
        userAgent: body.userAgent,
        ipAddress: body.ipAddress,
        userId: body.userId,
        sessionId: body.sessionId,
      };

      return await this.submissionService.submitForm(submissionData);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        `Error al enviar formulario: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id/submissions')
  @ApiOperation({ summary: 'Obtener envíos de un formulario' })
  @ApiParam({ name: 'id', description: 'ID del formulario' })
  @ApiResponse({ status: 200, description: 'Envíos obtenidos exitosamente' })
  async getFormSubmissions(@Param('id') formId: string) {
    try {
      return await this.submissionService.getSubmissionsByForm(formId);
    } catch (error) {
      throw new HttpException(
        `Error al obtener envíos: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Obtener estadísticas de un formulario' })
  @ApiParam({ name: 'id', description: 'ID del formulario' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
  })
  async getFormStats(@Param('id') formId: string) {
    try {
      return await this.submissionService.getSubmissionStats(formId);
    } catch (error) {
      throw new HttpException(
        `Error al obtener estadísticas: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validar campo de formulario' })
  @ApiResponse({ status: 200, description: 'Validación completada' })
  async validateField(@Body() body: { endpoint: string; value: string }) {
    try {
      return await this.validationService.validateField(
        body.endpoint,
        body.value,
      );
    } catch (error) {
      throw new HttpException(
        `Error en validación: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('autocomplete')
  @ApiOperation({ summary: 'Obtener datos de autocompletado' })
  @ApiResponse({
    status: 200,
    description: 'Datos de autocompletado obtenidos',
  })
  async getAutoCompleteData(
    @Body() body: { endpoint: string; value: string; context?: any },
  ) {
    try {
      return await this.validationService.getAutoCompleteData(
        body.endpoint,
        body.value,
        body.context,
      );
    } catch (error) {
      throw new HttpException(
        `Error en autocompletado: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('dependent-options')
  @ApiOperation({ summary: 'Obtener opciones dependientes' })
  @ApiResponse({ status: 200, description: 'Opciones dependientes obtenidas' })
  async getDependentOptions(
    @Body() body: { endpoint: string; parentValue: string },
  ) {
    try {
      return await this.validationService.getDependentOptions(
        body.endpoint,
        body.parentValue,
      );
    } catch (error) {
      throw new HttpException(
        `Error al obtener opciones dependientes: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
