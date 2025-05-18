import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { OrderService } from '../services/orders.service';
import { CreateOrderItemDto } from '../dtos/create-order.dto';
import { UpdateOrderItemDto } from '../dtos/update-order.dto';
import { OrderStatus } from '../enums/order-status.enum';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ 
    status: HttpStatus.CREATED,
    description: 'Order was successfully created'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data'
  })
  async createOrder(@Body() createOrderDto: CreateOrderItemDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Order found and returned'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order not found'
  })
  async getOrder(@Param('id') orderId: string) {
    return this.ordersService.getOrderById(orderId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiBody({ description: 'New order status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order status updated'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid status transition'
  })
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() updateOrderDto: UpdateOrderItemDto
  ) {
    return this.ordersService.updateOrderStatus(orderId, updateOrderDto.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Order was cancelled'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Order cannot be cancelled in current status'
  })
  async cancelOrder(@Param('id') orderId: string) {
    await this.ordersService.cancelOrder(orderId);
  }

  @Get()
  @ApiOperation({ summary: 'List all orders with filters' })
  @ApiQuery({ 
    name: 'status', 
    required: false,
    enum: OrderStatus,
    description: 'Filter by order status'
  })
  @ApiQuery({
    name: 'customerId',
    required: false,
    description: 'Filter by customer ID'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of filtered orders'
  })
  async listOrders(
    @Query('status') status?: OrderStatus,
    @Query('customerId') customerId?: string
  ) {
    return this.ordersService.listOrders({ status, customerId });
  }
}