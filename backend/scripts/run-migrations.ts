import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

// Charger les variables d'environnement
config({ path: path.resolve(__dirname, '../../.env') });

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'food_ordering',
  entities: [path.resolve(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [path.resolve(__dirname, '../migrations/*{.ts,.js}')],
  synchronize: false,
  logging: true,
  migrationsRun: false,
  migrationsTableName: 'migrations',
  timezone: 'Z',
  charset: 'utf8mb4',
  supportBigNumbers: true,
  bigNumberStrings: false,
  extra: {
    decimalNumbers: true,
  },
});

async function runMigrations() {
  try {
    console.log('Initializing data source...');
    await AppDataSource.initialize();
    
    console.log('Running migrations...');
    await AppDataSource.runMigrations();
    
    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

runMigrations();
