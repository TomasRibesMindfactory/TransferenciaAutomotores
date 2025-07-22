import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsArray,
  IsOptional,
  ValidateNested,
  Min,
  Max,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

export class VehiculoTransferenciaDto {
  @ApiProperty({
    description: 'Dominio del vehículo',
    example: 'ABC123',
  })
  @IsString()
  @IsNotEmpty()
  dominio: string;

  @ApiProperty({
    description: 'Código de alta',
    example: '001',
  })
  @IsString()
  @IsNotEmpty()
  codigoAlta: string;

  @ApiProperty({
    description: 'Fecha de alta del vehículo',
    example: '2020-01-14',
  })
  @IsDateString()
  fechaAlta: string;

  @ApiProperty({
    description: 'fecha de fabricación del vehículo',
    example: 2020,
    maxLength: 4,
    minLength: 4,
  })
  @IsNumber()
  fechaFabricacion: number;

  @ApiProperty({
    description: 'Fecha de inicio de vigencia',
    example: '2020-01-14',
  })
  @IsDateString()
  fechaInicio: string;

  @ApiProperty({
    description: 'Fecha que rige',
    example: '2020-01-14',
  })
  @IsDateString()
  fechaRige: string;

  @ApiProperty({
    description: 'Origen RNPA',
    example: 'N',
  })
  @IsString()
  @IsNotEmpty()
  origenRnpa: string;

  @ApiProperty({
    description: 'Código marca RNPA',
    example: '455436',
  })
  @IsString()
  @IsNotEmpty()
  marcaRnpa: string;

  @ApiProperty({
    description: 'Código tipo RNPA',
    example: '6356356',
  })
  @IsString()
  @IsNotEmpty()
  tipoRnpa: string;

  @ApiProperty({
    description: 'ID del archivo/automotor',
    example: 1,
  })
  @IsNumber()
  archivoId: number;
}

export class TransferenciaDetalleDto {
  @ApiProperty({
    description: 'Tipo de transferencia',
    example: 'C',
  })
  @IsString()
  @IsNotEmpty()
  tipoTransferencia: string;

  @ApiProperty({
    description: 'Fecha de transferencia',
    example: '2025-07-23',
  })
  @IsDateString()
  @IsOptional()
  fechaTransferencia?: string;

  @ApiProperty({
    description: 'Monto de la operación',
    example: 6784684,
  })
  @IsNumber()
  @IsOptional()
  montoOperacion?: number;

  @ApiProperty({
    description: 'Código de moneda',
    example: 'ARS',
  })
  @IsString()
  @IsOptional()
  moneda?: string;
}

export class VendedorDto {
  @ApiProperty({
    description: 'CUIT del vendedor',
    example: '20-12345678-9',
  })
  @IsString()
  @IsNotEmpty()
  @Length(13, 13)
  cuit: string;

  @ApiProperty({
    description: 'Descripción/nombre del vendedor',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;
}

export class CompradorDto {
  @ApiProperty({
    description: 'CUIT del comprador',
    example: '20-11111111-1',
  })
  @IsString()
  @IsNotEmpty()
  @Length(13, 13)
  cuit: string;

  @ApiProperty({
    description: 'Descripción/nombre del comprador',
    example: 'Carlos Rodríguez',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({
    description: 'Porcentaje de propiedad (1-100)',
    example: 32,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  porcentajePropiedad: number;

  @ApiProperty({
    description: 'Tipo de vínculo',
    example: 'PRO',
  })
  @IsString()
  @IsNotEmpty()
  tipoVinculo: string;

  @ApiProperty({
    description: 'Fecha de inicio del vínculo',
    example: '2025-07-03',
  })
  @IsDateString()
  fechaInicioVinculo: string;

  @ApiProperty({
    description: 'Indica si es responsable tributario',
    example: true,
  })
  @IsBoolean()
  esResponsable: boolean;
}

export class DocumentacionDto {
  @ApiProperty({
    description: 'Lista de documentos presentados',
    example: ['dni_comprador', 'formulario_08', 'libre_deuda'],
  })
  @IsArray()
  @IsString({ each: true })
  documentosPresentados: string[];

  @ApiProperty({
    description: 'Situación especial del vehículo',
    example: 'EMBARGO',
  })
  @IsString()
  @IsOptional()
  situacionEspecial?: string;

  @ApiProperty({
    description: 'Observaciones adicionales',
    example: 'ok',
  })
  @IsString()
  @IsOptional()
  observaciones?: string;

  @ApiProperty({
    description: 'Usuario que registra la transferencia',
    example: 'Usuario Sistema',
  })
  @IsString()
  @IsNotEmpty()
  usuarioAlta: string;

  @ApiProperty({
    description: 'Fecha y hora de alta de la transferencia',
    example: '2025-07-21T17:34:14.009Z',
  })
  @IsDateString()
  fechaAltaTransferencia: string;
}

export class TransferenciaFormularioDto {
  @ApiProperty({
    description: 'Datos del vehículo',
    type: VehiculoTransferenciaDto,
  })
  @ValidateNested()
  @Type(() => VehiculoTransferenciaDto)
  vehiculo: VehiculoTransferenciaDto;

  @ApiProperty({
    description: 'Datos de la transferencia',
    type: TransferenciaDetalleDto,
  })
  @ValidateNested()
  @Type(() => TransferenciaDetalleDto)
  transferencia: TransferenciaDetalleDto;

  @ApiProperty({
    description: 'Datos del vendedor',
    type: VendedorDto,
  })
  @ValidateNested()
  @Type(() => VendedorDto)
  vendedor: VendedorDto;

  @ApiProperty({
    description: 'Datos del comprador',
    type: CompradorDto,
  })
  @ValidateNested()
  @Type(() => CompradorDto)
  comprador: CompradorDto;

  @ApiProperty({
    description: 'Documentación y datos adicionales',
    type: DocumentacionDto,
  })
  @ValidateNested()
  @Type(() => DocumentacionDto)
  documentacion: DocumentacionDto;
}
