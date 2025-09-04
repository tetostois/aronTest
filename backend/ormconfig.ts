import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from './src/config';

const databaseConfig = config.database;

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: databaseConfig.synchronize,
  logging: databaseConfig.logging,
  migrationsRun: true,
  migrationsTableName: 'migrations',
  timezone: databaseConfig.timezone,
  charset: databaseConfig.charset,
  supportBigNumbers: databaseConfig.supportBigNumbers,
  bigNumberStrings: databaseConfig.bigNumberStrings,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
