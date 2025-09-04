import { PartialType } from '@nestjs/mapped-types';
import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsBoolean, 
  Min, 
  IsUrl, 
  Length,
  IsPositive,
  ValidateIf,
  IsUUID
} from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateMealDto } from './create-meal.dto';

export class UpdateMealDto extends PartialType(
  OmitType(CreateMealDto, ['restaurantId'] as const)
) {
  @ApiProperty({ 
    example: 'Pizza Margherita Deluxe', 
    description: 'Nouveau nom du repas',
    required: false 
  })
  @IsOptional()
  @IsString()
  @Length(2, 100, { message: 'Le nom doit contenir entre 2 et 100 caractères' })
  name?: string;

  @ApiProperty({ 
    example: 'Pizza classique avec sauce tomate, mozzarella et basilic frais', 
    description: 'Nouvelle description du repas',
    required: false 
  })
  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'La description ne peut pas dépasser 500 caractères' })
  description?: string;

  @ApiProperty({ 
    example: 14.99, 
    description: 'Nouveau prix du repas',
    required: false,
    minimum: 0.01
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive({ message: 'Le prix doit être un nombre positif' })
  @Min(0.01, { message: 'Le prix doit être supérieur à 0' })
  price?: number;

  @ApiProperty({ 
    example: 'https://example.com/images/pizza-deluxe.jpg', 
    description: 'Nouvelle URL de l\'image du repas',
    required: false 
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'L\'URL de l\'image n\'est pas valide' })
  imageUrl?: string;

  @ApiProperty({ 
    example: true, 
    description: 'Nouvel état de disponibilité du repas',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
