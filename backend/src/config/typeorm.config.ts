import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
// import { databaseConfig } from './database.config';

// Charger les variables d'environnement
import { config } from 'dotenv';
import databaseConfig from './database.config';
config({ path: '.env' });

const dbConfig = databaseConfig();

const typeOrmConfig: TypeOrmModuleOptions & Partial<DataSourceOptions> = {
  type: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: dbConfig.synchronize,
  logging: dbConfig.logging,
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsRun: true,
  ssl: dbConfig.ssl as any,
  migrationsTableName: 'migrations',
};

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  ...typeOrmConfig,
  host: configService.get<string>('database.host', dbConfig.host),
  port: configService.get<number>('database.port', dbConfig.port),
  username: configService.get<string>('database.username', dbConfig.username),
  password: configService.get<string>('database.password', dbConfig.password),
  database: configService.get<string>('database.database', dbConfig.database),
  synchronize: configService.get<boolean>('database.synchronize', dbConfig.synchronize),
  logging: configService.get<boolean>('database.logging', dbConfig.logging),
  ssl: configService.get<boolean>('database.ssl', dbConfig.ssl as boolean) ? { rejectUnauthorized: false } : false,
});

export default typeOrmConfig;
