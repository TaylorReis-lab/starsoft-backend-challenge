import { ConfigService } from '@nestjs/config'
import { KafkaOptions, Transport } from '@nestjs/microservices'

export const getKafkaConfig = (configService: ConfigService): KafkaOptions => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: [configService.getOrThrow<string>('KAFKA_BROKER')],
      clientId: configService.getOrThrow<string>('KAFKA_CLIENT_ID'),
    },
    consumer: {
      groupId: configService.getOrThrow<string>('KAFKA_GROUP_ID'),
    },
  },
})
