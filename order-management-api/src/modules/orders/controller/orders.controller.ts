import { Controller, Get, Post, Body, Param, Patch, Delete, Query, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OrderService } from '../services/orders.service';
import { OrderEntity } from '../entities/order.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { FilterOrderDto } from '../dtos/filter-order.dto';

@ApiTags('pedidos')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo pedido' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Pedido criado com sucesso',
    type: OrderEntity,
  })
  async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os pedidos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de pedidos retornada com sucesso',
    type: [OrderEntity],
  })
  async findAll(): Promise<OrderEntity[]> {
    return this.ordersService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar pedidos com filtros' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pedidos encontrados com base nos filtros',
    type: [OrderEntity],
  })
  async search(@Query() filterDto: FilterOrderDto): Promise<OrderEntity[]> {
    return this.ordersService.search(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um pedido pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do pedido' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pedido encontrado',
    type: OrderEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
  })
  async findById(@Param('id') id: string): Promise<OrderEntity> {
    return this.ordersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um pedido pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do pedido' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pedido atualizado com sucesso',
    type: OrderEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um pedido pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do pedido' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Pedido removido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.ordersService.remove(id);
  }
}