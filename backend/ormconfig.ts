import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from './src/config';

const databaseConfig = config.database;

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: databaseConfig.logging,
  migrationsRun: true,
  ssl: databaseConfig.ssl as any,
  migrationsTableName: 'migrations',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
