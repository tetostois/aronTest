import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import databaseConfig from './config/database.config';

// Charger les variables d'environnement
config({ path: '.env' });

const dbConfig = databaseConfig();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: dbConfig.synchronize,
  logging: dbConfig.logging,
  migrationsRun: true,
  migrationsTableName: 'migrations',
  timezone: 'Z', // Utiliser UTC comme timezone
  charset: 'utf8mb4',
  supportBigNumbers: true,
  bigNumberStrings: false,
  // Configuration spécifique à MySQL
  extra: {
    decimalNumbers: true,
    // Désactiver le support natif des UUID
    typeCast: function(field, next) {
      if (field.type === 'VAR_STRING' && field.length === 36) {
        return field.string();
      }
      return next();
    }
  }
});

export default AppDataSource;
