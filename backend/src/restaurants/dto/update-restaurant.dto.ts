import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { IsOptional, ValidateNested } from 'class-validator';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  @IsOptional()
  @ValidateNested()
  openingHours?: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };
}
