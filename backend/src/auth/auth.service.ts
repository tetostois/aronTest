import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException,
  BadRequestException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User, UserRole } from '../users/user.entity';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await user.validatePassword(pass))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const payload = { 
      email: user.email, 
      sub: user.id,
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    } as LoginResponseDto;
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    // Vérifier si l'email est déjà utilisé
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Vérifier que les mots de passe correspondent
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Les mots de passe ne correspondent pas');
    }

    // Créer un nouvel utilisateur (le hachage du mot de passe sera géré par le hook @BeforeInsert)
    const user = new User();
    user.name = registerDto.name;
    user.email = registerDto.email;
    user.password = registerDto.password; // Le mot de passe sera haché automatiquement
    user.role = registerDto.role || UserRole.USER;

    // Sauvegarder l'utilisateur dans la base de données
    const savedUser = await this.usersService.create(user);

    // Générer le token JWT
    const payload = { 
      email: savedUser.email, 
      sub: savedUser.id,
      role: savedUser.role 
    };
    const access_token = this.jwtService.sign(payload);

    // Ne pas renvoyer le mot de passe
    const { password, ...result } = savedUser;
    
    return {
      id: result.id,
      email: result.email,
      name: result.name,
      role: result.role,
      createdAt: result.createdAt,
      access_token
    } as RegisterResponseDto;
  }
}
