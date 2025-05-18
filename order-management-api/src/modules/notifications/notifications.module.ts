import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { KafkaNotificationService } from './services/kafka-notification.service'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'notification-service',
          },
        },
      },
    ]),
  ],
  providers: [KafkaNotificationService],
  exports: [KafkaNotificationService],
})
export class NotificationsModule {}
