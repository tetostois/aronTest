import { IsString, IsNumber, IsUUID, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  comment: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsUUID()
  userId: string;

  @IsUUID()
  mealId: string;
}
