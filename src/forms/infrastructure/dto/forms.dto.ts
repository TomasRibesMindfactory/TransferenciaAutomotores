import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FormListQueryDto {
  @ApiPropertyOptional({ description: 'Número de página', minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Elementos por página',
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ description: 'Categoría de formulario' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Formularios activos solamente' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Búsqueda por título o descripción' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class FormSubmissionDto {
  @ApiProperty({ description: 'Datos del formulario' })
  data: any;

  @ApiPropertyOptional({ description: 'User Agent del navegador' })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional({ description: 'Dirección IP del cliente' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'ID del usuario' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'ID de sesión' })
  @IsOptional()
  @IsString()
  sessionId?: string;
}

export class ValidateFieldDto {
  @ApiProperty({ description: 'Endpoint de validación' })
  @IsString()
  endpoint: string;

  @ApiProperty({ description: 'Valor a validar' })
  @IsString()
  value: string;
}

export class AutoCompleteDto {
  @ApiProperty({ description: 'Endpoint de autocompletado' })
  @IsString()
  endpoint: string;

  @ApiProperty({ description: 'Valor para autocompletar' })
  @IsString()
  value: string;

  @ApiPropertyOptional({ description: 'Contexto adicional' })
  @IsOptional()
  context?: any;
}

export class DependentOptionsDto {
  @ApiProperty({ description: 'Endpoint de opciones dependientes' })
  @IsString()
  endpoint: string;

  @ApiProperty({ description: 'Valor del campo padre' })
  @IsString()
  parentValue: string;
}
