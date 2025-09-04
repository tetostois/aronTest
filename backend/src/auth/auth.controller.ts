import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiCreatedResponse, 
  ApiBadRequestResponse, 
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

@ApiTags('Authentification')
@Controller('auth')
@UsePipes(new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
}))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Connexion utilisateur',
    description: 'Permet à un utilisateur de se connecter avec son email et son mot de passe.'
  })
  @ApiBody({ 
    type: LoginDto,
    description: 'Identifiants de connexion',
    examples: {
      user: {
        summary: 'Connexion standard',
        value: {
          email: 'utilisateur@example.com',
          password: 'MotDePasse123!'
        }
      }
    }
  })
  @ApiOkResponse({ 
    description: 'Connexion réussie',
    type: LoginResponseDto
  })
  @ApiUnauthorizedResponse({ 
    description: 'Identifiants invalides',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized'
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Données invalides',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be an email', 'password must be a string'],
        error: 'Bad Request'
      }
    }
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Inscription utilisateur',
    description: 'Permet à un nouvel utilisateur de créer un compte.'
  })
  @ApiBody({ 
    type: RegisterDto,
    description: 'Informations du nouvel utilisateur',
    examples: {
      user: {
        summary: 'Inscription standard',
        value: {
          name: 'Jean Dupont',
          email: 'jean.dupont@example.com',
          password: 'MotDePasse123!',
          confirmPassword: 'MotDePasse123!',
          role: 'user'
        }
      }
    }
  })
  @ApiCreatedResponse({ 
    description: 'Utilisateur enregistré avec succès',
    type: RegisterResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Données invalides',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'name must be longer than or equal to 2 characters',
          'email must be an email',
          'password is not strong enough',
          'confirmPassword must match password'
        ],
        error: 'Bad Request'
      }
    }
  })
  @ApiConflictResponse({
    description: 'Email déjà utilisé',
    schema: {
      example: {
        statusCode: 409,
        message: 'Email already in use',
        error: 'Conflict'
      }
    }
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
