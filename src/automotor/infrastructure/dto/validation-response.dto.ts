import { ApiProperty } from '@nestjs/swagger';

export class ValidationResponseDto {
  @ApiProperty({
    description: 'Indica si la validación fue exitosa',
    example: true,
  })
  isValid: boolean;

  @ApiProperty({
    description: 'Datos retornados por la validación (si es exitosa)',
    required: false,
  })
  data?: any;

  @ApiProperty({
    description: 'Mensaje de error (si la validación falló)',
    required: false,
    example: 'Dominio no encontrado',
  })
  error?: string;
}

export class DominioValidationDataDto {
  @ApiProperty({ description: 'ID del automotor', example: 1 })
  atrId?: number;

  @ApiProperty({ description: 'Dominio del automotor', example: 'AA123BB' })
  atrDominio?: string;

  @ApiProperty({ description: 'ID del tipo de vehículo', example: 'AUTO' })
  atrPthId?: string;

  @ApiProperty({ description: 'ID del modelo', example: 'GOL' })
  atrPmoId?: string;

  @ApiProperty({ description: 'ID del código de alta', example: '001' })
  atrPcaId?: string;

  @ApiProperty({ description: 'ID del registro automotor', example: 'RA001' })
  atrPrtId?: string;

  @ApiProperty({
    description: 'Fecha de alta',
    example: '2024-01-15T10:00:00Z',
  })
  atrFechaAlta?: Date;

  @ApiProperty({
    description: 'Fecha de inicio',
    example: '2024-01-15T10:00:00Z',
  })
  atrFechaInicio?: Date;

  @ApiProperty({
    description: 'Fecha de fabricación',
    example: '2024-01-01T00:00:00Z',
  })
  atrFechaFabricacion?: Date;

  @ApiProperty({
    description: 'Fecha de vigencia',
    example: '2024-01-15T10:00:00Z',
  })
  atrFechaRige?: Date;

  @ApiProperty({ description: 'Usuario que dio de alta', example: 'admin' })
  atrUsuarioAlta?: string;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:00:00Z',
  })
  atrFechaUltimaActualizacion?: Date;

  @ApiProperty({ description: 'ID de marca RNPA', example: 'VW' })
  atrIdMarcaRnpa?: string;

  @ApiProperty({ description: 'ID de tipo RNPA', example: 'SED' })
  atrIdTipoRnpa?: string;

  @ApiProperty({ description: 'ID de modelo RNPA', example: 'GOL' })
  atrIdModeloRnpa?: string;

  @ApiProperty({ description: 'Origen RNPA', example: 'NAC' })
  atrOrigenRnpa?: string;

  @ApiProperty({ description: 'Descripción de marca', example: 'Volkswagen' })
  lDescripcionMarca?: string;

  @ApiProperty({ description: 'Descripción de tipo', example: 'Automóvil' })
  lDescripcionTipo?: string;

  @ApiProperty({ description: 'Descripción de modelo', example: 'Gol Trend' })
  lDescripcionModelo?: string;

  @ApiProperty({
    description: 'Descripción del modelo RNPA',
    example: 'Gol Trend',
  })
  lPmoPmoDescripcion?: string;

  @ApiProperty({
    description: 'Descripción del código de alta',
    example: 'Primera Inscripción',
  })
  lPcaPcaDescripcion?: string;

  @ApiProperty({
    description: 'Descripción del registro automotor',
    example: 'Registro Córdoba',
  })
  lPrtPrtDescripcion?: string;

  @ApiProperty({
    description: 'Descripción del municipio',
    example: 'Córdoba Capital',
  })
  municipioDesc?: string;

  @ApiProperty({
    description: 'ID del objeto valor predeterminado',
    example: 1,
  })
  ovpId?: number;
}

export class CuitValidationDataDto {
  @ApiProperty({ description: 'ID del sujeto pasivo', example: 1 })
  spoId?: number;

  @ApiProperty({
    description: 'Denominación del sujeto pasivo',
    example: 'Juan Pérez',
  })
  spoDenominacion?: string;

  @ApiProperty({ description: 'Fecha de baja', required: false, example: null })
  spoFechaBaja?: Date;
}

export class ParametricValidationDataDto {
  @ApiProperty({
    description: 'Descripción del elemento paramétrico',
    example: 'Primera Inscripción',
  })
  descripcion?: string;
}
