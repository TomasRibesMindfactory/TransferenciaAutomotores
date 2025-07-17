import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomotorModule } from './automotor/automotor.module';
import { Automotor } from './automotor/infrastructure/entities/automotor.entity';
import { SujetoPasivo } from './automotor/infrastructure/entities/sujeto-pasivo.entity';
import { VinculoSujetoObjeto } from './automotor/infrastructure/entities/vinculo-sujeto-objeto.entity';
import { ObjetoValorPredeterminado } from './automotor/infrastructure/entities/objeto-valor-predeterminado.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost', 
      port: 1433, 
      username:'sa', 
      password:'Nicolas..8', 
      database:'TransferenciaAutomotor',
      entities: [Automotor, SujetoPasivo, VinculoSujetoObjeto, ObjetoValorPredeterminado],
      synchronize:true,
      extra :{
        trustServerCertificate:true,
      }
    }),
    AutomotorModule,
  ],
})
export class AppModule {} 