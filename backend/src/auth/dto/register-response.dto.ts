import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'ID de l\'utilisateur créé',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Adresse email de l\'utilisateur',
    example: 'jean.dupont@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nom complet de l\'utilisateur',
    example: 'Jean Dupont',
  })
  name: string;

  @ApiProperty({
    description: 'Rôle de l\'utilisateur',
    enum: ['user', 'admin', 'restaurant_owner'],
    example: 'user',
  })
  role: string;

  @ApiProperty({
    description: 'Date de création du compte',
    type: Date,
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
