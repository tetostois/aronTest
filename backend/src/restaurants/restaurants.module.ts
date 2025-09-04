import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { Restaurant } from './entities/restaurant.entity';
import { UsersModule } from '../users/users.module';
import { MealsModule } from '../meals/meals.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant]),
    UsersModule,
    forwardRef(() => MealsModule),
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
