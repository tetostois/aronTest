import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'your_jwt_secret_here',
  expiresIn: process.env.JWT_EXPIRATION || '1d',
  ignoreExpiration: process.env.NODE_ENV === 'development',
}));
