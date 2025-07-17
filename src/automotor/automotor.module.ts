import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomotorController } from './infrastructure/controllers/automotor.controller';
import { AutomotorService } from './application/services/automotor.service';
import { FormsModule } from '../forms/forms.module';

// Interfaces (puertos)
import { AutomotorRepositoryPort } from './domain/ports/automotor-repository.port';
import { SujetoPasivoRepositoryPort } from './domain/ports/sujeto-pasivo-repository.port';
import { VinculoSujetoObjetoRepositoryPort } from './domain/ports/vinculo-sujeto-objeto-repository.port';
import { ObjetoValorPredeterminadoRepositoryPort } from './domain/ports/objeto-valor-predeterminado-repository.port';

// Implementaciones (adaptadores)
import { AutomotorRepository } from './infrastructure/repositories/automotor.repository';
import { SujetoPasivoRepository } from './infrastructure/repositories/sujeto-pasivo.repository';
import { VinculoSujetoObjetoRepository } from './infrastructure/repositories/vinculo-sujeto-objeto.repository';
import { ObjetoValorPredeterminadoRepository } from './infrastructure/repositories/objeto-valor-predeterminado.repository';

import { SeedService } from './infrastructure/services/seed.service';

import { Automotor } from './infrastructure/entities/automotor.entity';
import { SujetoPasivo } from './infrastructure/entities/sujeto-pasivo.entity';
import { VinculoSujetoObjeto } from './infrastructure/entities/vinculo-sujeto-objeto.entity';
import { ObjetoValorPredeterminado } from './infrastructure/entities/objeto-valor-predeterminado.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Automotor,
      SujetoPasivo,
      VinculoSujetoObjeto,
      ObjetoValorPredeterminado,
    ]),
    FormsModule,
  ],
  controllers: [AutomotorController],
  providers: [
    AutomotorService,
    SeedService,

    // Asociación de interfaces con sus implementaciones
    {
      provide: AutomotorRepositoryPort,
      useClass: AutomotorRepository,
    },
    {
      provide: SujetoPasivoRepositoryPort,
      useClass: SujetoPasivoRepository,
    },
    {
      provide: VinculoSujetoObjetoRepositoryPort,
      useClass: VinculoSujetoObjetoRepository,
    },
    {
      provide: ObjetoValorPredeterminadoRepositoryPort,
      useClass: ObjetoValorPredeterminadoRepository,
    },
  ],
  exports: [AutomotorService],
})
export class AutomotorModule {}
