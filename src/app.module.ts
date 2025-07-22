import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AutomotorModule } from './automotor/automotor.module';
import { FormsModule } from './forms/forms.module';
import { Automotor } from './automotor/infrastructure/entities/automotor.entity';
import { SujetoPasivo } from './automotor/infrastructure/entities/sujeto-pasivo.entity';
import { VinculoSujetoObjeto } from './automotor/infrastructure/entities/vinculo-sujeto-objeto.entity';
import { ObjetoValorPredeterminado } from './automotor/infrastructure/entities/objeto-valor-predeterminado.entity';
import { Transferencia } from './automotor/infrastructure/entities/transferencia.entity';
import { ParTipoVehiculo } from './automotor/infrastructure/entities/par-tipo-vehiculo.entity';
import { ParModelo } from './automotor/infrastructure/entities/par-modelo.entity';
import { ParTipoVinculo } from './automotor/infrastructure/entities/par-tipo-vinculo.entity';
import { ParMoneda } from './automotor/infrastructure/entities/par-moneda.entity';
import { ParRegistroAutomotor } from './automotor/infrastructure/entities/par-registro-automotor.entity';
import { ParCodigoAlta } from './automotor/infrastructure/entities/par-codigo-alta.entity';
import { VinculoSituacionEspecial } from './automotor/infrastructure/entities/vinculo-situacion-especial.entity';
import { Usuario } from './automotor/infrastructure/entities/usuario.entity';
import { Form } from './forms/infrastructure/entities/form.entity';
import { FormField } from './forms/infrastructure/entities/form-field.entity';
import { FormSubmission } from './forms/infrastructure/entities/form-submission.entity';

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
          Transferencia,
          ParTipoVehiculo,
          ParModelo,
          ParTipoVinculo,
          ParMoneda,
          ParRegistroAutomotor,
          ParCodigoAlta,
          VinculoSituacionEspecial,
          Usuario,
          Form,
          FormField,
          FormSubmission,
        ],
        synchronize: true,
        logger: 'debug',
        dropSchema: true,
        extra: {
          trustServerCertificate: true,
        },
      }),
    }),
    AutomotorModule,
    FormsModule,
  ],
})
export class AppModule {}
