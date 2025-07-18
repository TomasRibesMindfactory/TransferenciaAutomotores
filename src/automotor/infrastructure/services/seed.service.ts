import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Automotor } from '../entities/automotor.entity';
import { SujetoPasivo } from '../entities/sujeto-pasivo.entity';
import { ObjetoValorPredeterminado } from '../entities/objeto-valor-predeterminado.entity';
import { VinculoSujetoObjeto } from '../entities/vinculo-sujeto-objeto.entity';
import { ParTipoVehiculo } from '../entities/par-tipo-vehiculo.entity';
import { ParModelo } from '../entities/par-modelo.entity';
import { ParTipoVinculo } from '../entities/par-tipo-vinculo.entity';
import { ParMoneda } from '../entities/par-moneda.entity';
import { ParRegistroAutomotor } from '../entities/par-registro-automotor.entity';
import { ParCodigoAlta } from '../entities/par-codigo-alta.entity';
import { Transferencia } from '../entities/transferencia.entity';
import { VinculoSituacionEspecial } from '../entities/vinculo-situacion-especial.entity';
import { Usuario } from '../entities/usuario.entity';
import { FormSeedService } from '../../../forms/infrastructure/services/form-seed.service';
import { FormFieldSeedService } from '../../../forms/infrastructure/services/form-field-seed.service';
import {
  seedAutomotores,
  seedSujetosPasivos,
  seedObjetosValorPredeterminado,
  seedVinculosSujetoObjeto,
  seedTransferencias,
  seedVinculosSituacionEspecial,
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
    @InjectRepository(ParTipoVehiculo)
    private readonly parTipoVehiculoRepository: Repository<ParTipoVehiculo>,
    @InjectRepository(ParModelo)
    private readonly parModeloRepository: Repository<ParModelo>,
    @InjectRepository(ParTipoVinculo)
    private readonly parTipoVinculoRepository: Repository<ParTipoVinculo>,
    @InjectRepository(ParMoneda)
    private readonly parMonedaRepository: Repository<ParMoneda>,
    @InjectRepository(ParRegistroAutomotor)
    private readonly parRegistroAutomotorRepository: Repository<ParRegistroAutomotor>,
    @InjectRepository(ParCodigoAlta)
    private readonly parCodigoAltaRepository: Repository<ParCodigoAlta>,
    @InjectRepository(Transferencia)
    private readonly transferenciaRepository: Repository<Transferencia>,
    @InjectRepository(VinculoSituacionEspecial)
    private readonly vinculoSituacionEspecialRepository: Repository<VinculoSituacionEspecial>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly formSeedService: FormSeedService,
    private readonly formFieldSeedService: FormFieldSeedService,
  ) {}

  async onModuleInit() {
    await this.seedDatabase();
    // Poblar formularios dinámicos después de los datos base
    await this.formSeedService.seedForms();
    await this.formFieldSeedService.seedFormFields();
  }

  async seedDatabase() {
    try {
      console.log(
        '🌱 Limpiando y poblando base de datos con datos de ejemplo...',
      );

      // Usar DELETE en lugar de TRUNCATE para evitar problemas con foreign keys
      // Eliminar en orden correcto (hijos primero)
      await this.transferenciaRepository.query('DELETE FROM TRANSFERENCIAS');
      await this.vinculoSituacionEspecialRepository.query(
        'DELETE FROM VINCULOS_SITUACION_ESPECIAL',
      );
      await this.vinculoRepository.query('DELETE FROM VINCULOS_SUJETO_OBJETO');
      await this.ovpRepository.query(
        'DELETE FROM OBJETOS_VALOR_PREDETERMINADO',
      );
      await this.sujetoPasivoRepository.query('DELETE FROM SUJETOS_PASIVOS');
      await this.automotorRepository.query('DELETE FROM AUTOMOTORES');

      // Eliminar datos paramétricos
      await this.parTipoVehiculoRepository.query(
        'DELETE FROM PAR_TIPOS_VEHICULO',
      );
      await this.parModeloRepository.query('DELETE FROM PAR_MODELOS');
      await this.parTipoVinculoRepository.query(
        'DELETE FROM PAR_TIPOS_VINCULOS',
      );
      await this.parMonedaRepository.query('DELETE FROM PAR_MONEDAS');
      await this.parRegistroAutomotorRepository.query(
        'DELETE FROM PAR_REGISTRO_AUTOMOTORES',
      );
      await this.parCodigoAltaRepository.query('DELETE FROM PAR_CODIGOS_ALTAS');
      await this.usuarioRepository.query('DELETE FROM USUARIO');

      console.log('🗑️ Datos existentes eliminados');

      // Insertar datos paramétricos primero
      await this.seedParametricData();

      // Insertar datos de dominio
      for (const automotor of seedAutomotores) {
        await this.automotorRepository.save(automotor);
      }
      console.log(`✅ ${seedAutomotores.length} automotores insertados`);

      // Insertar sujetos pasivos
      for (const sujeto of seedSujetosPasivos) {
        await this.sujetoPasivoRepository.save(sujeto);
      }
      console.log(`✅ ${seedSujetosPasivos.length} sujetos pasivos insertados`);

      // Insertar objetos valor predeterminado
      for (const objeto of seedObjetosValorPredeterminado) {
        await this.ovpRepository.save(objeto);
      }
      console.log(
        `✅ ${seedObjetosValorPredeterminado.length} objetos valor predeterminado insertados`,
      );

      // Insertar vínculos
      for (const vinculo of seedVinculosSujetoObjeto) {
        await this.vinculoRepository.save(vinculo);
      }
      console.log(`✅ ${seedVinculosSujetoObjeto.length} vínculos insertados`);

      // Insertar transferencias
      for (const transferencia of seedTransferencias) {
        await this.transferenciaRepository.save(transferencia);
      }
      console.log(`✅ ${seedTransferencias.length} transferencias insertadas`);

      // Insertar vínculos situación especial
      for (const vinculoSitEspecial of seedVinculosSituacionEspecial) {
        await this.vinculoSituacionEspecialRepository.save(vinculoSitEspecial);
      }
      console.log(
        `✅ ${seedVinculosSituacionEspecial.length} vínculos situación especial insertados`,
      );

      console.log('🎉 Seed completado exitosamente!');
    } catch (error) {
      console.error('❌ Error durante el seed:', error);
    }
  }

  private async seedParametricData() {
    const manager = this.parTipoVehiculoRepository.manager;
    
    try {
      // Tipos de vehículo usando SQL directo
      await manager.query(`
        INSERT INTO PAR_TIPOS_VEHICULO (PTH_ID, PTH_GRUPO, PTH_DESCRIPCION, PTH_FECHA_INICIO, PTH_FECHA_ALTA, PTH_USUARIO_ALTA) VALUES
        ('AUTO', 'LIV', 'Automóvil', '2020-01-01', '2025-07-18', 'SYSTEM'),
        ('MOTO', 'LIV', 'Motocicleta', '2020-01-01', '2025-07-18', 'SYSTEM'),
        ('CAM', 'PES', 'Camión', '2020-01-01', '2025-07-18', 'SYSTEM')
      `);

      // Modelos usando SQL directo
      await manager.query(`
        INSERT INTO PAR_MODELOS (PMO_ID, PMO_DESCRIPCION, PMO_FECHA_INICIO, PMO_FECHA_ALTA, PMO_USUARIO_ALTA, PMO_COD_MARCA) VALUES
        ('TOYOTA-COROLLA', 'Toyota Corolla', '2020-01-01', '2025-07-18', 'SYSTEM', 'TOY'),
        ('FORD-FOCUS', 'Ford Focus', '2020-01-01', '2025-07-18', 'SYSTEM', 'FOR'),
        ('HONDA-CIVIC', 'Honda Civic', '2020-01-01', '2025-07-18', 'SYSTEM', 'HON')
      `);

      // Tipos de vínculo usando SQL directo
      await manager.query(`
        INSERT INTO PAR_TIPOS_VINCULOS (PTV_ID, PTV_DESCRIPCION, PTV_FECHA_INICIO, PTV_FECHA_ALTA, PTV_USUARIO_ALTA) VALUES
        ('PROP', 'Propietario', '2020-01-01', '2025-07-18', 'SYSTEM'),
        ('POSE', 'Poseedor', '2020-01-01', '2025-07-18', 'SYSTEM'),
        ('UFRUC', 'Usufructuario', '2020-01-01', '2025-07-18', 'SYSTEM')
      `);

      // Monedas usando SQL directo
      await manager.query(`
        INSERT INTO PAR_MONEDAS (PMA_ID, PMA_DESCRIPCION, PMA_FECHA_INICIO, PMA_FECHA_ALTA, PMA_USUARIO_ALTA) VALUES
        ('PESO', 'Peso Argentino', '2020-01-01', '2025-07-18', 'SYSTEM'),
        ('USD', 'Dólar Estadounidense', '2020-01-01', '2025-07-18', 'SYSTEM')
      `);

      // Registros Automotor usando SQL directo
      await manager.query(`
        INSERT INTO PAR_REGISTRO_AUTOMOTORES (PRT_ID, PRT_DESCRIPCION, PRT_FECHA_INICIO, PRT_FECHA_ALTA, PRT_USUARIO_ALTA) VALUES
        ('REG01', 'Registro Nacional Automotor', '2020-01-01', '2025-07-18', 'SYSTEM'),
        ('REG02', 'Registro Provincial Buenos Aires', '2020-01-01', '2025-07-18', 'SYSTEM')
      `);

      // Códigos de Alta usando SQL directo
      await manager.query(`
        INSERT INTO PAR_CODIGOS_ALTAS (PCA_ID, PCA_PTA_ID, PCA_CODIGO_ALTA, PCA_DESCRIPCION, PCA_FECHA_INICIO, PCA_FECHA_ALTA, PCA_USUARIO_ALTA) VALUES
        ('ALT01', '001', 'ALTA01', 'Alta por Compra Nacional', '2020-01-01', '2025-07-18', 'SYSTEM'),
        ('ALT02', '001', 'ALTA02', 'Alta por Importación', '2020-01-01', '2025-07-18', 'SYSTEM')
      `);

      // Usuarios usando SQL directo
      await manager.query(`
        INSERT INTO USUARIO (CUSUARIO, USUARIO_ALTA, FECHA_ALTA, USR_FECHA_DESDE) VALUES
        ('ADMIN', 'SYSTEM', '2025-07-18', '2020-01-01'),
        ('OPERADOR', 'ADMIN', '2025-07-18', '2020-01-01')
      `);

      console.log('✅ Datos paramétricos insertados usando SQL directo');
    } catch (error) {
      console.error('❌ Error insertando datos paramétricos:', error);
      throw error;
    }
  }
}
