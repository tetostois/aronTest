import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException, 
  BadRequestException,
  Inject,
  forwardRef
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, UpdateOrderStatusDto } from './dto/update-order.dto';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user.entity';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { MealsService } from '../meals/meals.service';
import { OrderStatus } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly restaurantsService: RestaurantsService,
    @Inject(forwardRef(() => MealsService))
    private readonly mealsService: MealsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    // Vérifier que le restaurant existe
    const restaurant = await this.restaurantsService.findOne(createOrderDto.restaurantId);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Vérifier que les repas existent et appartiennent au bon restaurant
    const mealIds = createOrderDto.items.map(item => item.mealId);
    const meals = await this.mealsService.findByIds(mealIds);
    
    if (meals.length !== new Set(mealIds).size) {
      throw new NotFoundException('One or more meals not found');
    }

    // Vérifier que tous les repas appartiennent au bon restaurant
    const invalidMeals = meals.filter(meal => meal.restaurantId !== restaurant.id);
    if (invalidMeals.length > 0) {
      throw new BadRequestException('One or more meals do not belong to the specified restaurant');
    }

    // Créer la commande
    const order = this.orderRepository.create({
      status: createOrderDto.status || OrderStatus.PENDING,
      deliveryAddress: createOrderDto.deliveryAddress,
      specialInstructions: createOrderDto.specialInstructions,
      user: { id: userId },
      restaurant: { id: restaurant.id },
      totalAmount: 0, // Sera mis à jour après
    });

    const savedOrder = await this.orderRepository.save(order);

    // Créer les articles de la commande et calculer le total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of createOrderDto.items) {
      const meal = meals.find(m => m.id === item.mealId);
      if (!meal) continue;

      const orderItem = this.orderItemRepository.create({
        order: { id: savedOrder.id },
        meal: { id: meal.id },
        quantity: item.quantity,
        price: meal.price,
        specialInstructions: item.specialInstructions,
      });

      totalAmount += meal.price * item.quantity;
      orderItems.push(orderItem);
    }

    // Sauvegarder les articles et mettre à jour le total
    await this.orderItemRepository.save(orderItems);
    savedOrder.totalAmount = totalAmount;
    return this.orderRepository.save(savedOrder);
  }

  async findAll(user: User, filters: { restaurantId?: string, status?: OrderStatus[] } = {}) {
    const where: any = {};
    
    // Les clients ne voient que leurs commandes
    if (user.role === UserRole.CUSTOMER) {
      where.user = { id: user.id };
    } 
    // Les propriétaires ne voient que les commandes de leur restaurant
    else if (user.role === UserRole.OWNER) {
      where.restaurant = { owner: { id: user.id } };
    }
    // Les livreurs ne voient que les commandes qui leur sont assignées
    else if (user.role === UserRole.DELIVERY) {
      where.deliveryPerson = { id: user.id };
    }

    // Filtres supplémentaires
    if (filters.restaurantId) {
      where.restaurant = { id: filters.restaurantId };
    }
    
    if (filters.status && filters.status.length > 0) {
      where.status = In(filters.status);
    }

    return this.orderRepository.find({
      where,
      relations: ['user', 'restaurant', 'deliveryPerson', 'items', 'items.meal'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'restaurant', 'deliveryPerson', 'items', 'items.meal'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Vérifier les autorisations
    this.checkOrderAccess(order, user);
    
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, user: User): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'restaurant', 'deliveryPerson', 'items', 'items.meal'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Vérifier les autorisations
    this.checkOrderAccess(order, user, true);

    // Mise à jour des champs de base
    if (updateOrderDto.deliveryAddress !== undefined) {
      order.deliveryAddress = updateOrderDto.deliveryAddress;
    }
    if (updateOrderDto.specialInstructions !== undefined) {
      order.specialInstructions = updateOrderDto.specialInstructions;
    }
    if (updateOrderDto.deliveryPersonId) {
      order.deliveryPerson = { id: updateOrderDto.deliveryPersonId } as User;
    }
    if (updateOrderDto.status) {
      await this.updateOrderStatus(order, { status: updateOrderDto.status }, user);
    }

    // Mise à jour des articles de la commande si fournis
    if (updateOrderDto.items && updateOrderDto.items.length > 0) {
      // Supprimer les anciens articles
      await this.orderItemRepository.delete({ order: { id } });
      
      // Ajouter les nouveaux articles
      const orderItems = updateOrderDto.items.map(item => {
        return this.orderItemRepository.create({
          order: { id },
          meal: { id: item.mealId },
          quantity: item.quantity,
          price: 0, // À remplacer par le prix réel depuis la base de données
          specialInstructions: item.specialInstructions,
        });
      });

      await this.orderItemRepository.save(orderItems);
      
      // Recalculer le total
      // Note: Dans une application réelle, il faudrait récupérer les prix depuis la base de données
    }

    return this.orderRepository.save(order);
  }

  async updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto, user: User): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'restaurant', 'deliveryPerson'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Vérifier les autorisations
    this.checkOrderAccess(order, user, true);

    return this.updateOrderStatus(order, updateStatusDto, user);
  }

  async remove(id: string, user: User): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'restaurant'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Seul un admin ou le propriétaire du restaurant peut supprimer une commande
    if (user.role !== UserRole.ADMIN && 
        (user.role !== UserRole.OWNER || order.restaurant.ownerId !== user.id)) {
      throw new ForbiddenException('Not authorized to delete this order');
    }

    // Annuler la commande au lieu de la supprimer
    order.status = OrderStatus.CANCELLED;
    order.cancelledAt = new Date();
    order.cancellationReason = 'Order cancelled by ' + user.role;
    
    await this.orderRepository.save(order);
  }

  private async updateOrderStatus(
    order: Order, 
    updateStatusDto: UpdateOrderStatusDto, 
    user: User
  ): Promise<Order> {
    const { status, cancellationReason, deliveryPersonId, estimatedDeliveryTime } = updateStatusDto;
    
    // Vérifier les transitions d'état valides
    const validTransitions = this.getValidStatusTransitions(order.status, user.role);
    if (!validTransitions.includes(status)) {
      throw new BadRequestException(`Invalid status transition from ${order.status} to ${status}`);
    }

    // Mettre à jour le statut et les champs associés
    order.status = status;

    // Mettre à jour les champs en fonction du statut
    switch (status) {
      case OrderStatus.CANCELLED:
        order.cancelledAt = new Date();
        order.cancellationReason = cancellationReason || 'No reason provided';
        break;
      case OrderStatus.DELIVERED:
        order.deliveredAt = new Date();
        break;
      case OrderStatus.OUT_FOR_DELIVERY:
        if (deliveryPersonId) {
          order.deliveryPerson = { id: deliveryPersonId } as User;
        }
        break;
    }

    // Mettre à jour le temps de livraison estimé si fourni
    if (estimatedDeliveryTime) {
      order.estimatedDeliveryTime = new Date(estimatedDeliveryTime);
    }

    return this.orderRepository.save(order);
  }

  private getValidStatusTransitions(currentStatus: OrderStatus, userRole: UserRole): OrderStatus[] {
    // Définir les transitions valides en fonction du rôle et du statut actuel
    const transitions: Record<UserRole, Record<OrderStatus, OrderStatus[]>> = {
      [UserRole.ADMIN]: {
        [OrderStatus.PENDING]: [
          OrderStatus.CONFIRMED, 
          OrderStatus.CANCELLED
        ],
        [OrderStatus.CONFIRMED]: [
          OrderStatus.PREPARING, 
          OrderStatus.CANCELLED
        ],
        [OrderStatus.PREPARING]: [
          OrderStatus.READY_FOR_PICKUP, 
          OrderStatus.CANCELLED
        ],
        [OrderStatus.READY_FOR_PICKUP]: [
          OrderStatus.OUT_FOR_DELIVERY, 
          OrderStatus.CANCELLED
        ],
        [OrderStatus.OUT_FOR_DELIVERY]: [
          OrderStatus.DELIVERED, 
          OrderStatus.CANCELLED
        ],
        [OrderStatus.DELIVERED]: [],
        [OrderStatus.CANCELLED]: [],
      },
      [UserRole.OWNER]: {
        [OrderStatus.PENDING]: [OrderStatus.CONFIRMED],
        [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING],
        [OrderStatus.PREPARING]: [OrderStatus.READY_FOR_PICKUP],
        [OrderStatus.READY_FOR_PICKUP]: [],
        [OrderStatus.OUT_FOR_DELIVERY]: [],
        [OrderStatus.DELIVERED]: [],
        [OrderStatus.CANCELLED]: [],
      },
      [UserRole.DELIVERY]: {
        [OrderStatus.READY_FOR_PICKUP]: [OrderStatus.OUT_FOR_DELIVERY],
        [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED],
        [OrderStatus.PENDING]: [],
        [OrderStatus.CONFIRMED]: [],
        [OrderStatus.PREPARING]: [],
        [OrderStatus.DELIVERED]: [],
        [OrderStatus.CANCELLED]: [],
      },
      [UserRole.CUSTOMER]: {
        [OrderStatus.PENDING]: [OrderStatus.CANCELLED],
        [OrderStatus.CONFIRMED]: [OrderStatus.CANCELLED],
        [OrderStatus.PREPARING]: [],
        [OrderStatus.READY_FOR_PICKUP]: [],
        [OrderStatus.OUT_FOR_DELIVERY]: [],
        [OrderStatus.DELIVERED]: [],
        [OrderStatus.CANCELLED]: [],
      },
    };

    return transitions[userRole][currentStatus] || [];
  }

  private checkOrderAccess(order: Order, user: User, isModification: boolean = false): void {
    // L'admin a toujours accès
    if (user.role === UserRole.ADMIN) {
      return;
    }

    // Le client a accès à ses propres commandes
    if (user.role === UserRole.CUSTOMER && order.user.id === user.id) {
      return;
    }

    // Le propriétaire a accès aux commandes de son restaurant
    if (user.role === UserRole.OWNER && order.restaurant.ownerId === user.id) {
      return;
    }

    // Le livreur a accès aux commandes qui lui sont assignées
    if (user.role === UserRole.DELIVERY && order.deliveryPerson?.id === user.id) {
      return;
    }

    // Pour les modifications, des règles plus strictes peuvent s'appliquer
    if (isModification) {
      // Seul un admin ou le propriétaire du restaurant peut modifier une commande
      if (user.role === UserRole.OWNER && order.restaurant.ownerId === user.id) {
        return;
      }
      
      throw new ForbiddenException('Not authorized to modify this order');
    }

    throw new ForbiddenException('Not authorized to access this order');
  }
}
