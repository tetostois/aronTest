import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';
import { Meal } from './entities/meal.entity';
import { RestaurantsModule } from '../restaurants/restaurants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Meal]),
    RestaurantsModule,
  ],
  controllers: [MealsController],
  providers: [MealsService],
  exports: [MealsService],
})
export class MealsModule {}
