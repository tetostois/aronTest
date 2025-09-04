import { Type } from 'class-transformer';
import { 
  IsArray, 
  IsNotEmpty, 
  IsString, 
  IsUUID, 
  ValidateNested, 
  IsNumber, 
  Min, 
  IsOptional, 
  IsEnum 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderItemDto } from './create-order-item.dto';
import { OrderStatus } from '../entities/order.entity';

export class CreateOrderDto {
  @ApiProperty({ 
    description: 'ID du restaurant', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @IsUUID()
  @IsNotEmpty()
  restaurantId: string;

  @ApiProperty({ 
    type: [CreateOrderItemDto],
    description: 'Liste des articles de la commande' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({ 
    description: 'Adresse de livraison',
    required: false,
    example: '123 Rue de la Paix, 75001 Paris' 
  })
  @IsString()
  @IsOptional()
  deliveryAddress?: string;

  @ApiProperty({ 
    description: 'Instructions spéciales pour la commande',
    required: false,
    example: 'Sonner deux fois' 
  })
  @IsString()
  @IsOptional()
  specialInstructions?: string;

  @ApiProperty({ 
    description: 'Statut initial de la commande',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    required: false
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
