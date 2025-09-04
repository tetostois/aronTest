import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEmail, 
  IsPhoneNumber, 
  IsNumber, 
  Min, 
  Max, 
  IsBoolean,
  IsObject,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class OpeningHoursDto {
  @IsString()
  @IsNotEmpty()
  open: string;

  @IsString()
  @IsNotEmpty()
  close: string;
}

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => OpeningHoursDto)
  @IsOptional()
  openingHours?: {
    monday?: OpeningHoursDto;
    tuesday?: OpeningHoursDto;
    wednesday?: OpeningHoursDto;
    thursday?: OpeningHoursDto;
    friday?: OpeningHoursDto;
    saturday?: OpeningHoursDto;
    sunday?: OpeningHoursDto;
  };

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
