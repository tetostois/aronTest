import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from './entities/meal.entity';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';


@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
  ) {}

  async create(createMealDto: CreateMealDto): Promise<Meal> {
    const meal = this.mealRepository.create(createMealDto);
    return await this.mealRepository.save(meal);
  }

  async findAll(): Promise<Meal[]> {
    return await this.mealRepository.find();
  }

  async findOne(id: string): Promise<Meal> {
    const meal = await this.mealRepository.findOne({ 
      where: { id },
      relations: ['restaurant'] // Inclure la relation avec le restaurant
    });
    if (!meal) {
      throw new NotFoundException(`Repas avec l'ID ${id} non trouvé`);
    }
    return meal;
  }

  async update(id: string, updateMealDto: UpdateMealDto): Promise<Meal> {
    const result = await this.mealRepository.update(id, updateMealDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de mettre à jour le repas avec l'ID ${id} - non trouvé`);
    }
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.mealRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de supprimer le repas avec l'ID ${id} - non trouvé`);
    }
  }
}
