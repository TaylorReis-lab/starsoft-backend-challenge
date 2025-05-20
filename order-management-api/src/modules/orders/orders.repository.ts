import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between, Like } from 'typeorm'
import { OrderEntity } from './entities/order.entity'
import { CreateOrderDto } from './dtos/create-order.dto'
import { UpdateOrderDto } from './dtos/update-order.dto'
import { FilterOrderDto } from './dtos/filter-order.dto'

@Injectable()
export class OrdersRepository {
  save(order: OrderEntity): Promise<OrderEntity> {
    return this.orderRepository.save(order)
  }
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async findOne(orderId: string): Promise<OrderEntity | null> {
    return this.findById(orderId)
  }

  async create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    const totalAmount = createOrderDto.items.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    )

    const order = this.orderRepository.create({
      customerName: createOrderDto.customerName,
      customerEmail: createOrderDto.customerEmail,
      customerPhone: createOrderDto.customerPhone,
      shippingAddress: createOrderDto.shippingAddress,
      notes: createOrderDto.notes,
      totalAmount,
      items: createOrderDto.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    })

    return this.orderRepository.save(order)
  }

  async findAll(): Promise<OrderEntity[]> {
    return this.orderRepository.find({
      order: { createdAt: 'DESC' },
    })
  }

  async findById(id: string): Promise<OrderEntity | null> {
    return this.orderRepository.findOne({ where: { id } })
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity | null> {
    const order = await this.findById(id)

    if (!order) return null

    if (updateOrderDto.status) order.status = updateOrderDto.status
    if (updateOrderDto.shippingAddress)
      order.shippingAddress = updateOrderDto.shippingAddress
    if (updateOrderDto.notes) order.notes = updateOrderDto.notes

    return this.orderRepository.save(order)
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.orderRepository.delete(id)
    return (result.affected ?? 0) > 0
  }

  async filter(filterDto: FilterOrderDto): Promise<OrderEntity[]> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('OrderEntity')
      .leftJoinAndSelect('OrderEntity.items', 'items')

    if (filterDto.id)
      queryBuilder.andWhere('OrderEntity.id = :id', { id: filterDto.id })
    if (filterDto.status)
      queryBuilder.andWhere('OrderEntity.status = :status', {
        status: filterDto.status,
      })

    if (filterDto.startDate && filterDto.endDate) {
      queryBuilder.andWhere(
        'OrderEntity.createdAt BETWEEN :startDate AND :endDate',
        {
          startDate: filterDto.startDate,
          endDate: filterDto.endDate,
        },
      )
    } else if (filterDto.startDate) {
      queryBuilder.andWhere('OrderEntity.createdAt >= :startDate', {
        startDate: filterDto.startDate,
      })
    } else if (filterDto.endDate) {
      queryBuilder.andWhere('OrderEntity.createdAt <= :endDate', {
        endDate: filterDto.endDate,
      })
    }

    if (filterDto.item) {
      queryBuilder.andWhere(
        '(items.productId LIKE :item OR items.productName LIKE :item)',
        { item: `%${filterDto.item}%` },
      )
    }

    if (filterDto.query) {
      queryBuilder.andWhere(
        '(OrderEntity.customerName LIKE :query OR OrderEntity.customerEmail LIKE :query OR OrderEntity.shippingAddress LIKE :query OR OrderEntity.notes LIKE :query)',
        { query: `%${filterDto.query}%` },
      )
    }

    queryBuilder.orderBy('OrderEntity.createdAt', 'DESC')

    return queryBuilder.getMany()
  }
}
