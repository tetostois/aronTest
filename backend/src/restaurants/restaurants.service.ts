import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { User } from '@/users/user.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto, owner: User): Promise<Restaurant> {
    // Créer un restaurant avec les données de base
    const restaurant = new Restaurant();
    Object.assign(restaurant, createRestaurantDto);
    
    // Définir l'ID du propriétaire
    restaurant.ownerId = owner.id;
    
    // Sauvegarder le restaurant
    const savedRestaurant = await this.restaurantRepository.save(restaurant);
    
    // Ajouter les informations de base du propriétaire pour la réponse
    savedRestaurant.owner = {
      id: owner.id,
      name: owner.name,
      email: owner.email,
      role: owner.role,
    } as any; // Utilisation de any pour éviter les erreurs de type
    
    return savedRestaurant;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ data: Restaurant[]; total: number }> {
    const skip = (page - 1) * limit;
    const query = this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.owner', 'owner')
      .where('restaurant.isActive = :isActive', { isActive: true });

    if (search) {
      query.andWhere(
        '(LOWER(restaurant.name) LIKE :search OR LOWER(restaurant.description) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const [data, total] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id, isActive: true },
      relations: ['owner', 'meals'],
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    return restaurant;
  }

  async update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
    userId: string,
  ): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id, isActive: true },
      relations: ['owner'],
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    if (restaurant.owner.id !== userId) {
      throw new ForbiddenException('You are not the owner of this restaurant');
    }

    Object.assign(restaurant, updateRestaurantDto);
    return this.restaurantRepository.save(restaurant);
  }

  async remove(id: string, userId: string): Promise<void> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id, isActive: true },
      relations: ['owner'],
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    if (restaurant.owner.id !== userId) {
      throw new ForbiddenException('You are not the owner of this restaurant');
    }

    // Soft delete
    restaurant.isActive = false;
    await this.restaurantRepository.save(restaurant);
  }

  async findOwnerRestaurants(userId: string): Promise<Restaurant[]> {
    return this.restaurantRepository.find({
      where: { owner: { id: userId }, isActive: true },
    });
  }

  async updateAverageRating(restaurantId: string): Promise<void> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['meals', 'meals.reviews'],
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
    }

    // Calculate average rating from all meals' reviews
    let totalRating = 0;
    let totalReviews = 0;

    for (const meal of restaurant.meals) {
      if (meal.reviews && meal.reviews.length > 0) {
        const mealRatings = meal.reviews.map((review) => review.rating);
        totalRating += mealRatings.reduce((a, b) => a + b, 0);
        totalReviews += mealRatings.length;
      }
    }

    restaurant.averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
    await this.restaurantRepository.save(restaurant);
  }
}
