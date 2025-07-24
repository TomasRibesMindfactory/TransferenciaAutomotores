import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsObject,
  ValidateNested,
  Min,
  Max,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

class PropietarioDto {
  @ApiProperty({
    description: 'CUIT del propietario',
    example: '20-12345678-9',
  })
  @IsString()
  @IsNotEmpty()
  @Length(13, 13)
  cuit: string;

  @ApiProperty({
    description: 'Porcentaje de propiedad (1-100)',
    example: 100,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  porcentajePropiedad: number;

  @ApiProperty({
    description: 'Es responsable inscripto',
    example: true,
  })
  @IsBoolean()
  esResponsable: boolean;
}

class VehiculoDto {
  @ApiProperty({
    description: 'Patente del vehículo',
    example: 'AA123BB',
  })
  @IsString()
  @IsNotEmpty()
  patente: string;

  @ApiProperty({
    description: 'Año de fabricación',
    example: 2020,
  })
  @IsOptional()
  @IsNumber()
  anioFabricacion?: number;

  @ApiProperty({
    description: 'Número de motor',
    example: 'ABC123456',
  })
  @IsOptional()
  @IsString()
  numeroMotor?: string;

  @ApiProperty({
    description: 'Número de chasis',
    example: 'DEF789012',
  })
  @IsOptional()
  @IsString()
  numeroChasis?: string;

  @ApiProperty({
    description: 'Marca del vehículo',
    example: 'Ford',
  })
  @IsOptional()
  @IsString()
  marca?: string;

  @ApiProperty({
    description: 'Modelo del vehículo',
    example: 'Fiesta',
  })
  @IsOptional()
  @IsString()
  modelo?: string;

  @ApiProperty({
    description: 'Valor del vehículo',
    example: 1500000,
  })
  @IsOptional()
  @IsNumber()
  valor?: number;
}

export class AltaAutomotorDto {
  @ApiProperty({
    description: 'ID del objeto valor (patente)',
    example: 'AA123BB',
  })
  @IsString()
  @IsNotEmpty()
  ovpId: string;

  @ApiProperty({
    description: 'Tipo de operación',
    example: 'ALTA',
  })
  @IsOptional()
  @IsString()
  tipoOperacion?: string;

  @ApiProperty({
    description: 'Datos del propietario inicial',
    type: PropietarioDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => PropietarioDto)
  propietario: PropietarioDto;

  @ApiProperty({
    description: 'Datos del vehículo',
    type: VehiculoDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => VehiculoDto)
  vehiculo?: VehiculoDto;
}
