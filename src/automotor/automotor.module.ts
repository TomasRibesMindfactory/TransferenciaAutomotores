import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomotorController } from './infrastructure/controllers/automotor.controller';
import { TransferenciaController } from './infrastructure/controllers/transferencia.controller';
import { ValidationsController } from './infrastructure/controllers/validations.controller';
import { FormsValidationController } from './infrastructure/controllers/forms-validation.controller';
import { AutomotorService } from './application/services/automotor.service';
import { TransferenciaService } from './application/services/transferencia.service';
import { ValidationsService } from './application/services/validations.service';
import { FormsModule } from '../forms/forms.module';

// Implementaciones (adaptadores)
import { AutomotorRepository } from './infrastructure/repositories/automotor.repository';
import { SujetoPasivoRepository } from './infrastructure/repositories/sujeto-pasivo.repository';
import { VinculoSujetoObjetoRepository } from './infrastructure/repositories/vinculo-sujeto-objeto.repository';
import { ObjetoValorPredeterminadoRepository } from './infrastructure/repositories/objeto-valor-predeterminado.repository';
import { TransferenciaRepository } from './infrastructure/repositories/transferencia.repository';
import { ParTipoVehiculoRepository } from './infrastructure/repositories/par-tipo-vehiculo.repository';

import { SeedService } from './infrastructure/services/seed.service';

// Entidades
import { Automotor } from './infrastructure/entities/automotor.entity';
import { SujetoPasivo } from './infrastructure/entities/sujeto-pasivo.entity';
import { VinculoSujetoObjeto } from './infrastructure/entities/vinculo-sujeto-objeto.entity';
import { ObjetoValorPredeterminado } from './infrastructure/entities/objeto-valor-predeterminado.entity';
import { Transferencia } from './infrastructure/entities/transferencia.entity';
import { ParTipoVehiculo } from './infrastructure/entities/par-tipo-vehiculo.entity';
import { ParModelo } from './infrastructure/entities/par-modelo.entity';
import { ParTipoVinculo } from './infrastructure/entities/par-tipo-vinculo.entity';
import { ParMoneda } from './infrastructure/entities/par-moneda.entity';
import { ParRegistroAutomotor } from './infrastructure/entities/par-registro-automotor.entity';
import { ParCodigoAlta } from './infrastructure/entities/par-codigo-alta.entity';
import { VinculoSituacionEspecial } from './infrastructure/entities/vinculo-situacion-especial.entity';
import { Usuario } from './infrastructure/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Automotor,
      SujetoPasivo,
      VinculoSujetoObjeto,
      ObjetoValorPredeterminado,
      Transferencia,
      ParTipoVehiculo,
      ParModelo,
      ParTipoVinculo,
      ParMoneda,
      ParRegistroAutomotor,
      ParCodigoAlta,
      VinculoSituacionEspecial,
      Usuario,
    ]),
    FormsModule,
  ],
  controllers: [
    AutomotorController,
    TransferenciaController,
    ValidationsController,
    FormsValidationController,
  ],
  providers: [
    AutomotorService,
    TransferenciaService,
    ValidationsService,
    SeedService,

    // Asociación de interfaces con sus implementaciones
    {
      provide: 'AutomotorRepositoryPort',
      useClass: AutomotorRepository,
    },
    {
      provide: 'SujetoPasivoRepositoryPort',
      useClass: SujetoPasivoRepository,
    },
    {
      provide: 'VinculoSujetoObjetoRepositoryPort',
      useClass: VinculoSujetoObjetoRepository,
    },
    {
      provide: 'ObjetoValorPredeterminadoRepositoryPort',
      useClass: ObjetoValorPredeterminadoRepository,
    },
    {
      provide: 'TransferenciaRepositoryPort',
      useClass: TransferenciaRepository,
    },
    {
      provide: 'ParTipoVehiculoRepositoryPort',
      useClass: ParTipoVehiculoRepository,
    },
  ],
  exports: [AutomotorService, TransferenciaService],
})
export class AutomotorModule {}
