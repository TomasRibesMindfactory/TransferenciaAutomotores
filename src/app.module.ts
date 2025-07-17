import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AutomotorModule } from './automotor/automotor.module';
import { Automotor } from './automotor/infrastructure/entities/automotor.entity';
import { SujetoPasivo } from './automotor/infrastructure/entities/sujeto-pasivo.entity';
import { VinculoSujetoObjeto } from './automotor/infrastructure/entities/vinculo-sujeto-objeto.entity';
import { ObjetoValorPredeterminado } from './automotor/infrastructure/entities/objeto-valor-predeterminado.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mssql',
        host: configService.get('DB_HOST', 'localhost'),
        port: parseInt(configService.get('DB_PORT', '1433'), 10),
        username: configService.get('DB_USERNAME', 'sa'),
        password: configService.get('DB_PASSWORD', 'TransferApp2024!'),
        database: configService.get('DB_DATABASE', 'TransferenciaAutomotor'),
        entities: [
          Automotor,
          SujetoPasivo,
          VinculoSujetoObjeto,
          ObjetoValorPredeterminado,
        ],
        synchronize: true,
        extra: {
          trustServerCertificate: true,
        },
      }),
    }),
    AutomotorModule,
  ],
})
export class AppModule {}
