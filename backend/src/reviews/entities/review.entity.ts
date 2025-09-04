import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Meal } from '../../meals/entities/meal.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'int' })
  rating: number;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Meal, (meal) => meal.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mealId' })
  meal: Meal;

  @Column({ type: 'uuid' })
  mealId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
