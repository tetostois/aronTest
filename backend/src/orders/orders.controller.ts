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
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { OrdersService } from './orders.service';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, UpdateOrderStatusDto } from './dto/update-order.dto';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The order has been successfully created.',
    type: Order,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurant or meal not found.',
  })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req,
  ): Promise<Order> {
    return this.ordersService.create(createOrderDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OWNER, UserRole.DELIVERY, UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Get all orders' })
  @ApiQuery({
    name: 'restaurantId',
    required: false,
    description: 'Filter orders by restaurant ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter orders by status',
    enum: Object.values(UserRole),
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all orders.',
    type: [Order],
  })
  async findAll(
    @Request() req,
    @Query('restaurantId') restaurantId?: string,
    @Query('status') status?: string | string[],
  ): Promise<Order[]> {
    let statusArray: OrderStatus[] = [];
    if (status) {
      const statusValues = Array.isArray(status) ? status : [status];
      // Filtrer et mapper vers l'énumération OrderStatus
      statusArray = statusValues
        .filter(s => Object.values(OrderStatus).includes(s as OrderStatus))
        .map(s => s as OrderStatus);
    }
    return this.ordersService.findAll(req.user, { restaurantId, status: statusArray });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OWNER, UserRole.DELIVERY, UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the order.',
    type: Order,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not authorized to access this order.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req): Promise<Order> {
    return this.ordersService.findOne(id, req.user);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.OWNER, UserRole.DELIVERY)
  @ApiOperation({ summary: 'Update an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The order has been successfully updated.',
    type: Order,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not authorized to update this order.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Request() req,
  ): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto, req.user);
  }

  @Put(':id/status')
  @Roles(UserRole.ADMIN, UserRole.OWNER, UserRole.DELIVERY, UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The order status has been successfully updated.',
    type: Order,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid status transition.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not authorized to update this order status.',
  })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
    @Request() req,
  ): Promise<Order> {
    return this.ordersService.updateStatus(id, updateStatusDto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The order has been successfully cancelled.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not authorized to delete this order.',
  })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<void> {
    return this.ordersService.remove(id, req.user);
  }
}
