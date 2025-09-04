import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsUUID, 
  IsBoolean, 
  Min, 
  Max, 
  IsUrl, 
  Length,
  IsPositive
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMealDto {
  @ApiProperty({ example: 'Pizza Margherita', description: 'Nom du repas' })
  @IsString()
  @Length(2, 100, { message: 'Le nom doit contenir entre 2 et 100 caractères' })
  name: string;

  @ApiProperty({ 
    example: 'Pizza classique avec sauce tomate et mozzarella', 
    description: 'Description du repas',
    required: false 
  })
  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'La description ne peut pas dépasser 500 caractères' })
  description?: string;

  @ApiProperty({ 
    example: 12.99, 
    description: 'Prix du repas',
    minimum: 0.01
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive({ message: 'Le prix doit être un nombre positif' })
  @Min(0.01, { message: 'Le prix doit être supérieur à 0' })
  price: number;

  @ApiProperty({ 
    example: 'https://example.com/images/pizza.jpg', 
    description: 'URL de l\'image du repas',
    required: false 
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'L\'URL de l\'image n\'est pas valide' })
  imageUrl?: string;

  @ApiProperty({ 
    example: true, 
    description: 'Indique si le repas est disponible à la commande',
    required: false,
    default: true 
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean = true;

  @IsUUID()
  restaurantId: string;
}
