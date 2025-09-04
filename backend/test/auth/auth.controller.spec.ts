import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { clearDatabase, createTestUser } from '../test-utils';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    connection = moduleFixture.get<Connection>(Connection);
    await app.init();
  });

  afterAll(async () => {
    await clearDatabase(connection);
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'user',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userData.email);
      expect(response.body.name).toBe(userData.name);
      expect(response.body.role).toBe(userData.role);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should not register with an existing email', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
        role: 'user',
      };

      // First registration
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(HttpStatus.CREATED);

      // Second registration with same email
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /auth/login', () => {
    const testUser = {
      email: 'login@test.com',
      password: 'password123',
      name: 'Login Test User',
      role: 'user',
    };

    beforeAll(async () => {
      await createTestUser(connection, testUser);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should not login with invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('Protected Routes', () => {
    let authToken: string;
    const protectedUser = {
      email: 'protected@test.com',
      password: 'password123',
      name: 'Protected User',
      role: 'user',
    };

    beforeAll(async () => {
      await createTestUser(connection, protectedUser);
      
      // Login to get token
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: protectedUser.email,
          password: protectedUser.password,
        });
      
      authToken = response.body.access_token;
    });

    it('should access protected route with valid token', async () => {
      await request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);
    });

    it('should not access protected route without token', async () => {
      await request(app.getHttpServer())
        .get('/profile')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should not access protected route with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
