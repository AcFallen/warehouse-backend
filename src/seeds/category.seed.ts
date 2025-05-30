import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function seedCategories() {
  console.log('🌱 Starting category seeding...');

  // Crear la aplicación NestJS
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Obtener el repositorio de categorías
    const categoryRepository = app.get<Repository<Category>>(
      getRepositoryToken(Category),
    );

    // Datos de categorías por defecto
    const defaultCategories = [
      {
        name: 'Beverages',
        description: 'Drinks and liquids including sodas, juices, and water',
        isActive: true,
      },
      {
        name: 'Food',
        description: 'Perishable and non-perishable food items',
        isActive: true,
      },
      {
        name: 'Tools',
        description: 'Warehouse and utility tools for operations',
        isActive: true,
      },
      {
        name: 'Electronics',
        description: 'Electronic devices and components',
        isActive: true,
      },
      {
        name: 'Cleaning Supplies',
        description: 'Cleaning and maintenance products',
        isActive: true,
      },
    ];

    let seededCount = 0;
    let existingCount = 0;

    for (const categoryData of defaultCategories) {
      // Verificar si la categoría ya existe
      const existingCategory = await categoryRepository.findOne({
        where: { name: categoryData.name },
      });

      if (!existingCategory) {
        const category = categoryRepository.create(categoryData);
        await categoryRepository.save(category);
        console.log(`✅ Seeded category: ${categoryData.name}`);
        seededCount++;
      } else {
        console.log(`⏭️  Category already exists: ${categoryData.name}`);
        existingCount++;
      }
    }

    console.log(`\n📊 Seeding Summary:`);
    console.log(`   • New categories created: ${seededCount}`);
    console.log(`   • Categories already existed: ${existingCount}`);
    console.log(`   • Total categories processed: ${defaultCategories.length}`);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  } finally {
    // Cerrar la aplicación
    await app.close();
  }
}

// Ejecutar el seed
if (require.main === module) {
  seedCategories()
    .then(() => {
      console.log('\n🎉 Category seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Category seeding failed:', error);
      process.exit(1);
    });
}
