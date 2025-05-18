import { OrderStatus } from '../enums/order-status.enum'
import { KafkaTopics } from '../../shared/enums/kafka-topics.enum'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateOrderItemDto } from '../dtos/create-order.dto'

@Injectable()
export class OrderService {
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

  async createOrder(createOrderDto: CreateOrderItemDto) {
    // Criar pedido
    const order = this.orderRepository.create({
      items: [createOrderDto],
      status: OrderStatus.CREATED,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const savedOrder = await this.orderRepository.save(order)

    // Emitir evento Kafka para pedido criado
    await this.kafkaClient
      .emit(KafkaTopics.ORDER_CREATED, {
        orderId: savedOrder.id,
        status: savedOrder.status,
        createdAt: savedOrder.createdAt,
        items: savedOrder.items,
      })
      .toPromise()

    return savedOrder
  }

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
