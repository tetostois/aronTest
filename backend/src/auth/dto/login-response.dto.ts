import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT Access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  access_token: string;

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
      email: { type: 'string', example: 'utilisateur@example.com' },
      name: { type: 'string', example: 'Jean Dupont' },
      role: { 
        type: 'string', 
        enum: ['user', 'admin', 'restaurant_owner'],
        example: 'user' 
      }
    },
    description: 'Informations sur l\'utilisateur connecté'
  })
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
