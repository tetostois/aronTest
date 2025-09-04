import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { MealsService } from './meals.service';
import { Meal } from './entities/meal.entity';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('meals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  @Roles(UserRole.OWNER)
  async create(@Body() createMealDto: CreateMealDto): Promise<Meal> {
    return this.mealsService.create(createMealDto);
  }

  @Get()
  async findAll(): Promise<Meal[]> {
    return this.mealsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Meal> {
    return this.mealsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.OWNER)
  async update(
    @Param('id') id: string,
    @Body() updateMealDto: UpdateMealDto,
  ): Promise<Meal> {
    return this.mealsService.update(id, updateMealDto);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<void> {
    return this.mealsService.remove(id);
  }
}
