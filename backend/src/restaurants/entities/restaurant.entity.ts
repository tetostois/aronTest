import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToMany, 
  CreateDateColumn, 
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Meal } from '../../meals/entities/meal.entity';

export type OpeningHours = {
  [key: string]: { open: string; close: string } | null;
  monday: { open: string; close: string } | null;
  tuesday: { open: string; close: string } | null;
  wednesday: { open: string; close: string } | null;
  thursday: { open: string; close: string } | null;
  friday: { open: string; close: string } | null;
  saturday: { open: string; close: string } | null;
  sunday: { open: string; close: string } | null;
};

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ type: 'jsonb', nullable: true })
  openingHours: OpeningHours;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.restaurants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ type: 'uuid' })
  ownerId: string;

  @OneToMany(() => Meal, (meal) => meal.restaurant)
  meals: Meal[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
