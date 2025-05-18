import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common'
import { Kafka, Producer, RecordMetadata } from 'kafkajs'

export interface OrderEvent {
  orderId: string
  customerId: string
  total: number
  createdAt: string // ISO string
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
}

@Injectable()
export class KafkaNotificationService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaNotificationService.name)
  private kafka: Kafka
  private producer: Producer

  async onModuleInit() {
    this.kafka = new Kafka({
      clientId: 'order-notification-service',
      brokers: ['localhost:9092'], // ajuste para seu broker Kafka
    })
    this.producer = this.kafka.producer()
    await this.producer.connect()
    this.logger.log('Kafka producer connected')
  }

  async onModuleDestroy() {
    await this.producer.disconnect()
    this.logger.log('Kafka producer disconnected')
  }

  async notifyOrderCreated(orderEvent: OrderEvent): Promise<RecordMetadata[]> {
    this.logger.log(
      `Sending order created event for order ${orderEvent.orderId}`,
    )

    const message = {
      key: orderEvent.orderId,
      value: JSON.stringify(orderEvent),
    }

    return this.producer.send({
      topic: 'order-events',
      messages: [message],
    })
  }
}
