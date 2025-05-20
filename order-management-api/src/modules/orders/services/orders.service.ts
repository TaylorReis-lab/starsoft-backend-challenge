import { KafkaTopics } from '../../shared/enums/kafka-topics.enum'
import { OrderEntity } from '../entities/order-item.entity'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateOrderDto } from '../dtos/create-order.dto'
import { FilterOrderDto } from '../dtos/filter-order.dto'
import { UpdateOrderDto } from '../dtos/update-order.dto'
import { OrderStatus } from '../entities/order.entity'
import { OrdersRepository } from '../orders.repository'
import { KafkaProducerService } from '@kafka/kafka-producer.service'

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrdersRepository,
    private readonly kafkaClient: KafkaProducerService,
  ) {}

  remove(id: string): void | PromiseLike<void> {
    throw new Error('Method not implemented.')
  }
  update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ):
    | import('../entities/order.entity').OrderEntity
    | PromiseLike<import('../entities/order.entity').OrderEntity> {
    throw new Error('Method not implemented.')
  }
  findById(
    id: string,
  ):
    | import('../entities/order.entity').OrderEntity
    | PromiseLike<import('../entities/order.entity').OrderEntity> {
    throw new Error('Method not implemented.')
  }
  search(
    filterDto: FilterOrderDto,
  ):
    | import('../entities/order.entity').OrderEntity[]
    | PromiseLike<import('../entities/order.entity').OrderEntity[]> {
    throw new Error('Method not implemented.')
  }
  findAll():
    | import('../entities/order.entity').OrderEntity[]
    | PromiseLike<import('../entities/order.entity').OrderEntity[]> {
    throw new Error('Method not implemented.')
  }
  create(
    createOrderDto: CreateOrderDto,
  ):
    | import('../entities/order.entity').OrderEntity
    | PromiseLike<import('../entities/order.entity').OrderEntity> {
    throw new Error('Method not implemented.')
  }
  getOrderById(orderId: string) {
    throw new Error('Method not implemented.')
  }
  listOrders(arg0: {
    status: OrderStatus | undefined
    customerId: string | undefined
  }) {
    throw new Error('Method not implemented.')
  }
  findOne(arg0: string) {
    throw new Error('Method not implemented.')
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.orderRepository.findOne(orderId)

    if (!order) {
      throw new NotFoundException('Order not found')
    }

    order.status = status
    order.updatedAt = new Date()

    const updatedOrder = await this.orderRepository.save(order)

    await this.kafkaClient.emit(KafkaTopics.ORDER_STATUS_CHANGED, {
      orderId: updatedOrder.id,
      newStatus: updatedOrder.status,
      updatedAt: updatedOrder.updatedAt,
    })

    return updatedOrder
  }

  async cancelOrder(orderId: string) {
    const order = await this.orderRepository.findOne(orderId)

    if (!order) {
      throw new NotFoundException('Order not found')
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order already cancelled')
    }

    const nonCancellableStatuses = [
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
    ] as const

    if (
      order.status === OrderStatus.SHIPPED ||
      order.status === OrderStatus.DELIVERED
    ) {
      throw new BadRequestException(
        `Cannot cancel order in ${order.status} status`,
      )
    }

    order.status = OrderStatus.CANCELLED
    order.updatedAt = new Date()
    await this.orderRepository.save(order)

    // Emitir evento Kafka para status cancelado
    this.kafkaClient.emit(KafkaTopics.ORDER_STATUS_CHANGED, {
      orderId,
      newStatus: order.status,
      updatedAt: new Date(),
    })
  }
}
