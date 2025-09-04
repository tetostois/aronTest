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
  type: 'mysql',
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
  migrationsTableName: 'migrations',
  timezone: dbConfig.timezone,
  charset: dbConfig.charset,
  supportBigNumbers: dbConfig.supportBigNumbers,
  bigNumberStrings: dbConfig.bigNumberStrings,
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
  timezone: configService.get<string>('database.timezone', dbConfig.timezone),
  charset: configService.get<string>('database.charset', dbConfig.charset),
  supportBigNumbers: configService.get<boolean>('database.supportBigNumbers', dbConfig.supportBigNumbers),
  bigNumberStrings: configService.get<boolean>('database.bigNumberStrings', dbConfig.bigNumberStrings),
});

export default typeOrmConfig;
