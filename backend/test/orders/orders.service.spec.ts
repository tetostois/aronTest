import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdersService } from '../../src/orders/orders.service';
import { Order } from '../../src/orders/entities/order.entity';
import { OrderItem } from '../../src/orders/entities/order-item.entity';
import { RestaurantsService } from '../../src/restaurants/restaurants.service';
import { MealsService } from '../../src/meals/meals.service';
import { User } from '../../src/users/entities/user.entity';
import { UserRole } from '../../src/users/entities/user.entity';
import { OrderStatus } from '../../src/orders/entities/order.entity';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;
  let restaurantsService: RestaurantsService;
  let mealsService: MealsService;

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockOrderItemRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockRestaurantsService = {
    findOne: jest.fn(),
  };

  const mockMealsService = {
    findByIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemRepository,
        },
        {
          provide: RestaurantsService,
          useValue: mockRestaurantsService,
        },
        {
          provide: MealsService,
          useValue: mockMealsService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderItemRepository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
    restaurantsService = module.get<RestaurantsService>(RestaurantsService);
    mealsService = module.get<MealsService>(MealsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto = {
        restaurantId: 'restaurant-1',
        items: [
          { mealId: 'meal-1', quantity: 2 },
        ],
        deliveryAddress: '123 Test St',
      };

      const mockRestaurant = { id: 'restaurant-1', ownerId: 'owner-1' };
      const mockMeal = { id: 'meal-1', price: 10, restaurantId: 'restaurant-1' };
      const mockOrder = {
        id: 'order-1',
        ...createOrderDto,
        totalAmount: 20,
        status: OrderStatus.PENDING,
      };

      mockRestaurantsService.findOne.mockResolvedValue(mockRestaurant);
      mockMealsService.findByIds.mockResolvedValue([mockMeal]);
      mockOrderRepository.create.mockReturnValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(mockOrder);
      mockOrderItemRepository.save.mockResolvedValue({});

      const result = await service.create(createOrderDto as any, 'user-1');

      expect(restaurantsService.findOne).toHaveBeenCalledWith(createOrderDto.restaurantId);
      expect(mealsService.findByIds).toHaveBeenCalledWith([createOrderDto.items[0].mealId]);
      expect(orderRepository.create).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });
  });

  describe('findAll', () => {
    it('should return all orders for admin', async () => {
      const mockOrders = [{ id: 'order-1' }, { id: 'order-2' }];
      const mockUser = { id: 'admin-1', role: UserRole.ADMIN } as User;
      
      mockOrderRepository.find.mockResolvedValue(mockOrders);

      const result = await service.findAll(mockUser, {});

      expect(orderRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      const mockOrder = { id: 'order-1', userId: 'user-1' };
      const mockUser = { id: 'user-1', role: UserRole.CUSTOMER } as User;
      
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOne('order-1', mockUser);

      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        relations: ['user', 'restaurant', 'deliveryPerson', 'items', 'items.meal'],
      });
      expect(result).toEqual(mockOrder);
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const mockOrder = { 
        id: 'order-1', 
        status: OrderStatus.PENDING,
        save: jest.fn().mockResolvedValue({ id: 'order-1', status: OrderStatus.CONFIRMED })
      };
      const mockUser = { id: 'owner-1', role: UserRole.OWNER } as User;
      const updateStatusDto = { status: OrderStatus.CONFIRMED };
      
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.updateStatus('order-1', updateStatusDto, mockUser);

      expect(mockOrder.save).toHaveBeenCalled();
      expect(result.status).toBe(OrderStatus.CONFIRMED);
    });
  });

  describe('remove', () => {
    it('should cancel an order', async () => {
      const mockOrder = { 
        id: 'order-1',
        status: OrderStatus.PENDING,
        cancelledAt: null,
        cancellationReason: null,
        save: jest.fn().mockResolvedValue({})
      };
      const mockUser = { id: 'owner-1', role: UserRole.OWNER } as User;
      
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      await service.remove('order-1', mockUser);

      expect(mockOrder.status).toBe(OrderStatus.CANCELLED);
      expect(mockOrder.cancelledAt).toBeDefined();
      expect(mockOrder.cancellationReason).toBeDefined();
      expect(mockOrder.save).toHaveBeenCalled();
    });
  });
});
