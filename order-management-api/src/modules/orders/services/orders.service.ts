import { OrderStatus } from '../enums/order-status.enum'
import { KafkaTopics } from '../../shared/enums/kafka-topics.enum'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateOrderDto } from '../dtos/create-order.dto'
import { FilterOrderDto } from '../dtos/filter-order.dto'
import { UpdateOrderDto } from '../dtos/update-order.dto'

@Injectable()
export class OrderService {
  remove(id: string): void | PromiseLike<void> {
    throw new Error('Method not implemented.')
  }
  update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ):
    | import('../entities/order.entity').Order
    | PromiseLike<import('../entities/order.entity').Order> {
    throw new Error('Method not implemented.')
  }
  findById(
    id: string,
  ):
    | import('../entities/order.entity').Order
    | PromiseLike<import('../entities/order.entity').Order> {
    throw new Error('Method not implemented.')
  }
  search(
    filterDto: FilterOrderDto,
  ):
    | import('../entities/order.entity').Order[]
    | PromiseLike<import('../entities/order.entity').Order[]> {
    throw new Error('Method not implemented.')
  }
  findAll():
    | import('../entities/order.entity').Order[]
    | PromiseLike<import('../entities/order.entity').Order[]> {
    throw new Error('Method not implemented.')
  }
  create(
    createOrderDto: CreateOrderDto,
  ):
    | import('../entities/order.entity').Order
    | PromiseLike<import('../entities/order.entity').Order> {
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
  constructor(
    private readonly orderRepository: any,
    private readonly kafkaClient: any,
  ) {}

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.orderRepository.findOne(orderId)

    if (!order) {
      throw new NotFoundException('Order not found')
    }

    order.status = status
    order.updatedAt = new Date()

    const updatedOrder = await this.orderRepository.save(order)

    // Emitir evento Kafka para status atualizado
    await this.kafkaClient
      .emit(KafkaTopics.ORDER_STATUS_CHANGED, {
        orderId: updatedOrder.id,
        newStatus: updatedOrder.status,
        updatedAt: updatedOrder.updatedAt,
      })
      .toPromise()

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

    if ([OrderStatus.DELIVERED, OrderStatus.SHIPPED].includes(order.status)) {
      throw new BadRequestException(
        `Cannot cancel order in ${order.status} status`,
      )
    }

    order.status = OrderStatus.CANCELLED
    order.updatedAt = new Date()
    await this.orderRepository.save(order)

    // Emitir evento Kafka para status cancelado
    await this.kafkaClient
      .emit(KafkaTopics.ORDER_STATUS_CHANGED, {
        orderId,
        newStatus: order.status,
      })
      .toPromise()
  }
}
