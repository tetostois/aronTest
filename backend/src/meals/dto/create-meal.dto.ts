import { IsString, IsNumber, IsOptional, IsUUID, IsBoolean } from 'class-validator';

export class CreateMealDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean = true;

  @IsUUID()
  restaurantId: string;
}
