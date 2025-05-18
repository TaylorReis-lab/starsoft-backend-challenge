import { Controller, Get, Inject } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { Client } from '@elastic/elasticsearch'
import { DataSource } from 'typeorm'

@Controller('health')
export class HealthController {
  constructor(
    private dataSource: DataSource,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly elasticsearchClient: Client,
  ) {}

  @Get()
  async check() {
    // Test DB connection
    let dbStatus = 'down'
    try {
      await this.dataSource.query('SELECT 1')
      dbStatus = 'up'
    } catch {}

    // Test Kafka (simplificado)
    let kafkaStatus = 'down'
    try {
      // Exemplo: checar se topic existe, ou só conectar
      await this.kafkaClient.connect()
      kafkaStatus = 'up'
    } catch {}

    // Test Elasticsearch
    let esStatus = 'down'
    try {
      const health = await this.elasticsearchClient.cluster.health()
      return health
    } catch {}

    return {
      database: dbStatus,
      kafka: kafkaStatus,
      elasticsearch: esStatus,
      zookeeper: 'unknown', // ou 'up' se você testar
    }
  }
}
