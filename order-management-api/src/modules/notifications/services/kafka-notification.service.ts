import { Injectable } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'

@Injectable()
export class KafkaNotificationService {
  notifyProductCreated(product: { id: string; name: string; price: number }) {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly kafkaClient: ClientKafka) {}

  async sendOrderCreatedEvent(payload: any) {
    await this.kafkaClient.emit('ORDER_CREATED', payload).toPromise()
  }

  async sendStatusChangedEvent(payload: any) {
    await this.kafkaClient.emit('ORDER_STATUS_CHANGED', payload).toPromise()
  }
}
