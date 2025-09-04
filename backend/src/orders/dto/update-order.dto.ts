import { PartialType } from '@nestjs/mapped-types';
import { 
  IsEnum, 
  IsOptional, 
  IsString, 
  IsUUID, 
  IsNumber, 
  IsArray, 
  ValidateNested,
  IsDateString
} from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'Nouveau statut de la commande',
    enum: OrderStatus,
    example: OrderStatus.PREPARING
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({
    description: 'Raison de l\'annulation (si le statut est annulé)',
    required: false,
    example: 'Rupture de stock'
  })
  @IsString()
  @IsOptional()
  cancellationReason?: string;

  @ApiProperty({
    description: 'ID du livreur (si le statut est en cours de livraison)',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsOptional()
  deliveryPersonId?: string;

  @ApiProperty({
    description: 'Temps estimé de livraison (ISO date string)',
    required: false,
    example: '2025-09-04T14:30:00.000Z'
  })
  @IsDateString()
  @IsOptional()
  estimatedDeliveryTime?: string;
}

export class UpdateOrderDto extends PartialType(
  OmitType(CreateOrderDto, ['restaurantId'] as const)
) {
  @ApiProperty({
    description: 'ID du livreur',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsOptional()
  deliveryPersonId?: string;

  @ApiProperty({
    description: 'Statut de la commande',
    enum: OrderStatus,
    required: false,
    example: OrderStatus.DELIVERED
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
