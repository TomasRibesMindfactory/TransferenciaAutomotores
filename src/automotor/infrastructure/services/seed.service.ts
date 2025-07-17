import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Automotor } from '../entities/automotor.entity';
import { SujetoPasivo } from '../entities/sujeto-pasivo.entity';
import { ObjetoValorPredeterminado } from '../entities/objeto-valor-predeterminado.entity';
import { VinculoSujetoObjeto } from '../entities/vinculo-sujeto-objeto.entity';
import { FormSeedService } from '../../../forms/infrastructure/services/form-seed.service';
import { FormFieldSeedService } from '../../../forms/infrastructure/services/form-field-seed.service';
import {
  seedAutomotores,
  seedSujetosPasivos,
  seedObjetosValorPredeterminado,
  seedVinculosSujetoObjeto,
} from '../data/seed-data';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Automotor)
    private readonly automotorRepository: Repository<Automotor>,
    @InjectRepository(SujetoPasivo)
    private readonly sujetoPasivoRepository: Repository<SujetoPasivo>,
    @InjectRepository(ObjetoValorPredeterminado)
    private readonly ovpRepository: Repository<ObjetoValorPredeterminado>,
    @InjectRepository(VinculoSujetoObjeto)
    private readonly vinculoRepository: Repository<VinculoSujetoObjeto>,
    private readonly formSeedService: FormSeedService,
    private readonly formFieldSeedService: FormFieldSeedService,
  ) {}

  async onModuleInit() {
    await this.seedDatabase();
    // Poblar formularios dinámicos después de los datos base
    await this.formSeedService.seedForms();
    await this.formFieldSeedService.seedFormFields();
  }

  private async seedDatabase() {
    try {
      // Verificar si ya hay datos
      const automotoresCount = await this.automotorRepository.count();
      if (automotoresCount > 0) {
        console.log('📊 Base de datos ya contiene datos, omitiendo seed...');
        return;
      }

      console.log('🌱 Poblando base de datos con datos de ejemplo...');

      // Insertar automotores
      const automotores = await this.automotorRepository.save(seedAutomotores);
      console.log(`✅ ${automotores.length} automotores insertados`);

      // Insertar sujetos pasivos
      const sujetosPasivos =
        await this.sujetoPasivoRepository.save(seedSujetosPasivos);
      console.log(`✅ ${sujetosPasivos.length} sujetos pasivos insertados`);

      // Insertar objetos valor predeterminado
      const objetosValor = await this.ovpRepository.save(
        seedObjetosValorPredeterminado,
      );
      console.log(
        `✅ ${objetosValor.length} objetos valor predeterminado insertados`,
      );

      // Insertar vínculos sujeto objeto
      const vinculos = await this.vinculoRepository.save(
        seedVinculosSujetoObjeto,
      );
      console.log(`✅ ${vinculos.length} vínculos sujeto objeto insertados`);

      console.log('🎉 Base de datos poblada exitosamente!');
      console.log('📋 Datos de ejemplo disponibles:');
      console.log('   - Automotores: ABC123, XYZ789, DEF456');
      console.log(
        '   - CUITs: 20-12345678-9, 20-87654321-0, 20-11111111-1, 20-22222222-2',
      );
    } catch (error) {
      console.error('❌ Error al poblar la base de datos:', error);
    }
  }
}
