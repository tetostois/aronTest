import { IsEmail, IsString, MinLength, MaxLength, IsNotEmpty, IsEnum, Validate, Matches } from 'class-validator';
import { UserRole } from '../../users/user.entity';

// Custom validator to check if password and confirmPassword match
const passwordMatch = (value: any, { object }: any) => {
  return object.password === object.confirmPassword;
};

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @MaxLength(50)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/, {
    message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
  })
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @IsNotEmpty()
  @Validate(passwordMatch, {
    message: 'Les mots de passe ne correspondent pas',
  })
  confirmPassword: string;

  @IsEnum(UserRole, { message: 'Rôle utilisateur invalide' })
  role: UserRole = UserRole.USER;
}
