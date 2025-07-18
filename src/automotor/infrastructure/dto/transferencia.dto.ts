import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CrearTransferenciaDto {
  @IsNotEmpty()
  @IsNumber()
  ovpOvpId: number;

  @IsNotEmpty()
  @IsNumber()
  spoId: number;

  @IsNotEmpty()
  @IsNumber()
  spoIdNuevoDueno: number;

  @IsNotEmpty()
  @IsDateString()
  fechaTransferencia: string;

  @IsNotEmpty()
  @IsString()
  pmaId: string;

  @IsOptional()
  @IsNumber()
  importeSellos?: number;

  @IsOptional()
  @IsNumber()
  importeTransferencia?: number;

  @IsNotEmpty()
  @IsString()
  atrDominio: string;

  @IsNotEmpty()
  @IsString()
  atrPthId: string;

  @IsNotEmpty()
  @IsString()
  usuarioAlta: string;
}

export class ConsultarTransferenciaDto {
  @IsOptional()
  @IsString()
  dominio?: string;

  @IsOptional()
  @IsNumber()
  sujetoPasivoId?: number;

  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaHasta?: string;
}
