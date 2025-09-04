import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  UseGuards, 
  Query,
  Request,
  ParseUUIDPipe,
  BadRequestException,
  HttpStatus
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { MealsService } from './meals.service';
import { Meal } from './entities/meal.entity';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('meals')
@Controller('meals')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Créer un nouveau repas' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Le repas a été créé avec succès',
    type: Meal
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Accès refusé - Vous devez être le propriétaire du restaurant' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Restaurant non trouvé' 
  })
  async create(
    @Body() createMealDto: CreateMealDto,
    @Request() req: any
  ): Promise<Meal> {
    return this.mealsService.create(createMealDto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les repas (avec filtrage optionnel)' })
  @ApiQuery({ 
    name: 'restaurantId', 
    required: false, 
    description: 'Filtrer les repas par ID de restaurant' 
  })
  @ApiQuery({ 
    name: 'available', 
    required: false, 
    description: 'Filtrer les repas disponibles (true/false)' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Liste des repas récupérée avec succès',
    type: [Meal]
  })
  async findAll(
    @Query('restaurantId') restaurantId?: string,
    @Query('available') available?: string
  ): Promise<Meal[]> {
    // Si un ID de restaurant est fourni, retourner les repas de ce restaurant
    if (restaurantId) {
      return this.mealsService.findMealsByRestaurant(restaurantId);
    }
    
    // Sinon, retourner tous les repas (avec filtrage optionnel)
    return this.mealsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un repas par son ID' })
  @ApiParam({ name: 'id', description: 'ID du repas à récupérer' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Le repas a été trouvé',
    type: Meal
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Repas non trouvé' 
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Meal> {
    return this.mealsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Mettre à jour un repas' })
  @ApiParam({ name: 'id', description: 'ID du repas à mettre à jour' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Le repas a été mis à jour avec succès',
    type: Meal
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Repas non trouvé' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Accès refusé - Vous devez être le propriétaire du restaurant' 
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMealDto: UpdateMealDto,
    @Request() req: any
  ): Promise<Meal> {
    return this.mealsService.update(id, updateMealDto, req.user?.id);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Supprimer un repas' })
  @ApiParam({ name: 'id', description: 'ID du repas à supprimer' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Le repas a été supprimé avec succès' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Repas non trouvé' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Accès refusé - Vous devez être le propriétaire du restaurant ou un administrateur' 
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any
  ): Promise<void> {
    return this.mealsService.remove(id, req.user?.id);
  }
}
