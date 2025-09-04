import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Meal } from './entities/meal.entity';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { RestaurantsService } from '../restaurants/restaurants.service';


@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
    private readonly restaurantsService: RestaurantsService,
  ) {}

  async create(createMealDto: CreateMealDto, userId?: string): Promise<Meal> {
    // Vérifier si le restaurant existe
    const restaurant = await this.restaurantsService.findOne(createMealDto.restaurantId);
    
    // Vérifier si l'utilisateur est le propriétaire du restaurant
    if (userId && restaurant.ownerId !== userId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à ajouter un repas à ce restaurant');
    }

    const meal = this.mealRepository.create({
      ...createMealDto,
      restaurant: { id: createMealDto.restaurantId }
    });
    
    return await this.mealRepository.save(meal);
  }

  async findAll(restaurantId?: string): Promise<Meal[]> {
    const where = {} as any;
    if (restaurantId) {
      where.restaurant = { id: restaurantId };
    }
    
    return await this.mealRepository.find({
      where,
      relations: ['restaurant'],
      order: { name: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Meal> {
    const meal = await this.mealRepository.findOne({ 
      where: { id },
      relations: ['restaurant'] 
    });
    
    if (!meal) {
      throw new NotFoundException(`Repas avec l'ID "${id}" non trouvé`);
    }
    
    return meal;
  }

  async findByIds(ids: string[]): Promise<Meal[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    
    return await this.mealRepository.find({
      where: { id: In(ids) },
      relations: ['restaurant']
    });
  }

  async update(id: string, updateMealDto: UpdateMealDto, userId?: string): Promise<Meal> {
    // Vérifier si le repas existe
    const meal = await this.mealRepository.findOne({
      where: { id },
      relations: ['restaurant']
    });
    
    if (!meal) {
      throw new NotFoundException(`Repas avec l'ID ${id} non trouvé`);
    }

    // Vérifier si l'utilisateur est le propriétaire du restaurant
    if (userId && meal.restaurant.ownerId !== userId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à modifier ce repas');
    }

    // Mettre à jour les champs fournis
    Object.assign(meal, updateMealDto);
    
    return await this.mealRepository.save(meal);
  }

  async remove(id: string, userId?: string): Promise<void> {
    // Vérifier si le repas existe
    const meal = await this.mealRepository.findOne({
      where: { id },
      relations: ['restaurant']
    });
    
    if (!meal) {
      throw new NotFoundException(`Repas avec l'ID ${id} non trouvé`);
    }

    // Vérifier si l'utilisateur est le propriétaire du restaurant
    if (userId && meal.restaurant.ownerId !== userId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à supprimer ce repas');
    }

    const result = await this.mealRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de supprimer le repas avec l'ID ${id} - non trouvé`);
    }
  }
  
  async findMealsByRestaurant(restaurantId: string): Promise<Meal[]> {
    return this.mealRepository.find({
      where: { 
        restaurant: { id: restaurantId },
        isAvailable: true
      },
      order: { name: 'ASC' }
    });
  }
}
