import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create(createReviewDto);
    return await this.reviewRepository.save(review);
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewRepository.find({
      relations: ['user', 'meal'],
    });
  }

  async findOne(id: string): Promise<Review> {
    return await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'meal'],
    });
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    await this.reviewRepository.update(id, updateReviewDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.reviewRepository.delete(id);
  }

  async findByMealId(mealId: string): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { mealId },
      relations: ['user'],
    });
  }
}
