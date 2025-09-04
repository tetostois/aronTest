import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Meal } from '../../meals/entities/meal.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('text', { nullable: true })
  specialInstructions: string;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Meal)
  @JoinColumn({ name: 'meal_id' })
  meal: Meal;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discount: number;
}
