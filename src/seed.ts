import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './automotor/infrastructure/services/seed.service';

async function runSeed() {
  console.log('🌱 Ejecutando seed independiente...');

  const app = await NestFactory.create(AppModule);
  const seedService = app.get(SeedService);

  try {
    await seedService.seedDatabase();
    console.log('✅ Seed ejecutado exitosamente');
  } catch (error) {
    console.error('❌ Error ejecutando seed:', error);
  } finally {
    await app.close();
  }
}

runSeed().catch(console.error);
