import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @Roles(UserRole.CUSTOMER)
  async create(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  async findAll(): Promise<Review[]> {
    return this.reviewsService.findAll();
  }

  @Get('meal/:mealId')
  async findByMealId(@Param('mealId') mealId: string): Promise<Review[]> {
    return this.reviewsService.findByMealId(mealId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Review> {
    return this.reviewsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<void> {
    return this.reviewsService.remove(id);
  }
}
