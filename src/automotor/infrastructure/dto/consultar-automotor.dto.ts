import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class ConsultarAutomotorDto {
  @ApiProperty({
    description: 'Dominio del automotor',
    example: 'ABC123',
    minLength: 1,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  dominio: string;
} 