import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_here',
    expiresIn: process.env.JWT_EXPIRATION || '1d',
    ignoreExpiration: process.env.NODE_ENV === 'development',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_here',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  password: {
    saltRounds: 10,
    resetTokenExpiresIn: '1h',
  },
  emailVerification: {
    tokenExpiresIn: '24h',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
  },
  facebook: {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/api/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name'],
  },
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  },
}));
