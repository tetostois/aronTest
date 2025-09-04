import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Review } from '../../reviews/entities/review.entity';

@Entity('meals')
export class Meal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isAvailable: boolean;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.meals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @Column({ type: 'uuid' })
  restaurantId: string;

  @OneToMany(() => Review, (review) => review.meal)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
