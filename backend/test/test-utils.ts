import { Connection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import { User } from '../src/users/user.entity';

export const clearDatabase = async (connection: Connection) => {
  const entities = connection.entityMetadatas;
  
  for (const entity of entities) {
    const repository = connection.getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE \"${entity.tableName}" CASCADE;`);
  }
};

export const createTestUser = async (
  connection: Connection, 
  userData: { email: string; name: string; role: string; password: string }
): Promise<User> => {
  const user = new User();
  user.email = userData.email;
  user.name = userData.name;
  user.role = userData.role as any;
  user.password = await bcrypt.hash(userData.password, 10);
  
  const userRepository = connection.getRepository(User);
  return userRepository.save(user);
};

export const getTestAuthToken = async (app: any, email: string, password: string): Promise<string> => {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password });
  
  return response.body.access_token;
};

// Utilitaire pour faciliter les requêtes authentifiées
export const authenticatedRequest = (app: any, token: string) => {
  return request(app.getHttpServer())
    .set('Authorization', `Bearer ${token}`);
};
