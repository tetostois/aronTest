import { IsEmail, IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'utilisateur@example.com',
    description: 'Adresse email de l\'utilisateur',
    required: true,
  })
  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide' })
  @IsNotEmpty({ message: 'L\'email est obligatoire' })
  @MaxLength(100, { message: 'L\'email ne doit pas dépasser 100 caractères' })
  email: string;

  @ApiProperty({
    example: 'MonMotDePasse123!',
    description: 'Mot de passe de l\'utilisateur',
    required: true,
    minLength: 8,
    maxLength: 50,
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  @MaxLength(50, { message: 'Le mot de passe ne doit pas dépasser 50 caractères' })
  password: string;
}
