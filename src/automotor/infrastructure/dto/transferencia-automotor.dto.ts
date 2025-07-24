import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDateString,
  Min,
  Max,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class TransferenciaAutomotorDto {
  @ApiProperty({
    description: 'CUIT del nuevo titular',
    example: '20-12345678-9',
    minLength: 13,
    maxLength: 13,
  })
  @IsString()
  @IsNotEmpty()
  @Length(13, 13)
  cuit: string;

  @ApiProperty({
    description: 'Porcentaje de copropiedad (1-100)',
    example: 100,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  porcentaje: number;

  @ApiProperty({
    description: 'Fecha de inicio del vínculo',
    example: '2024-01-15',
  })
  @IsDateString()
  fechaInicio: string;

  @ApiProperty({
    description: 'Indicador de responsable',
    example: true,
  })
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  responsable: boolean;
}
