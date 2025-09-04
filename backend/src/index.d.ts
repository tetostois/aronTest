// Déclaration des modules pour les imports de fichiers non-TypeScript
declare module '*.json' {
  const value: any;
  export default value;
}

// Déclaration des types globaux
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: string;
    
    // Base de données
    DB_HOST: string;
    DB_PORT: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
    
    // JWT
    JWT_SECRET: string;
    JWT_EXPIRATION: string;
    
    // CORS
    FRONTEND_URL: string;
  }
}

// Déclaration des types pour les modules personnalisés
declare module 'src/config' {
  import { TypeOrmModuleOptions } from '@nestjs/typeorm';
  
  export const config: {
    app: {
      port: number;
      nodeEnv: string;
      isProduction: boolean;
      isDevelopment: boolean;
      frontendUrl: string;
    };
    database: {
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
      synchronize: boolean;
      logging: boolean;
      ssl: boolean | { rejectUnauthorized: boolean };
    };
    jwt: {
      secret: string;
      expiresIn: string;
      ignoreExpiration: boolean;
    };
  };
  
  export type AppConfig = typeof config;
  
  export const typeOrmConfig: TypeOrmModuleOptions;
  export function getTypeOrmConfig(configService: any): TypeOrmModuleOptions;
}

// Déclaration des types pour les entités
declare module 'src/users/user.entity' {
  import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ unique: true })
    email: string;
    
    @Column()
    password: string;
    
    @Column({ nullable: true })
    firstName: string;
    
    @Column({ nullable: true })
    lastName: string;
    
    @Column({ default: 'user' })
    role: 'user' | 'restaurant_owner' | 'admin';
    
    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;
    
    validatePassword(password: string): Promise<boolean>;
  }
}

// Déclaration des types pour les DTO
declare module 'src/auth/dto' {
  export class LoginDto {
    email: string;
    password: string;
  }
  
  export class RegisterDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: 'user' | 'restaurant_owner' | 'admin';
  }
  
  export class AuthResponseDto {
    accessToken: string;
    user: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      role: string;
    };
  }
}
