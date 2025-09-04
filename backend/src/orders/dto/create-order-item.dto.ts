import { IsUUID, IsInt, Min, IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({ description: 'ID du repas à commander', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  mealId: string;

  @ApiProperty({ description: 'Quantité du repas', example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ 
    description: 'Instructions spéciales pour ce repas', 
    example: 'Sans oignons, sauce à part',
    required: false 
  })
  @IsString()
  @IsOptional()
  specialInstructions?: string;
}
