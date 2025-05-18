import { ClientsModule, Transport } from '@nestjs/microservices';

export const KafkaProvider = ClientsModule.register([
  {
    name: 'KAFKA_SERVICE',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'order',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'order-consumer',
      },
    },
  },
]);