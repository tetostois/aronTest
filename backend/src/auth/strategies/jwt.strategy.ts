import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserRole } from '../../users/user.entity';

type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: configService.get('auth.jwt.ignoreExpiration', false),
      secretOrKey: configService.get('auth.jwt.secret'),
      algorithms: ['HS256'],
    });
  }

  async validate(payload: JwtPayload): Promise<Partial<User>> {
    return { 
      id: payload.sub, 
      email: payload.email, 
      role: payload.role 
    };
  }
}
