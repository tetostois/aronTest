// Export des configurations
export * from './typeorm.config';
export { default as appConfig } from './app.config';
export { default as databaseConfig } from './database.config';
export { default as jwtConfig } from './jwt.config';

// Configuration globale pour rétrocompatibilité
import appConfig from './app.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';

export const config = {
  app: appConfig(),
  database: databaseConfig(),
  jwt: jwtConfig(),
};

export type AppConfig = typeof config;
