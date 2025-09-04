import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  ParseUUIDPipe,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({ status: 201, description: 'Restaurant successfully created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createRestaurantDto: CreateRestaurantDto, @Req() req) {
    return this.restaurantsService.create(createRestaurantDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all restaurants with pagination' })
  @ApiResponse({ status: 200, description: 'Return all restaurants' })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.restaurantsService.findAll(page, limit, search);
  }

  @Get('my-restaurants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get restaurants owned by the current user' })
  @ApiResponse({ status: 200, description: 'Return user\'s restaurants' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findMyRestaurants(@Req() req) {
    return this.restaurantsService.findOwnerRestaurants(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a restaurant by ID' })
  @ApiResponse({ status: 200, description: 'Return the restaurant' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a restaurant' })
  @ApiResponse({ status: 200, description: 'Restaurant successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @Req() req,
  ) {
    return this.restaurantsService.update(id, updateRestaurantDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a restaurant' })
  @ApiResponse({ status: 200, description: 'Restaurant successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    return this.restaurantsService.remove(id, req.user.id);
  }
}
