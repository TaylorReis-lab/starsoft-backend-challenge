import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderService } from './services/orders.service'
import { OrdersController } from './controller/orders.controller'
import { OrderEntity } from './entities/order.entity'
import { OrdersRepository } from './orders.repository'
import { KafkaProducerService } from '@kafka/kafka-producer.service'
import { KafkaModule } from '@kafka/kafka.module'
import { ElasticsearchModule } from '@nestjs/elasticsearch'

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), KafkaModule, ElasticsearchModule],
  controllers: [OrdersController],
  providers: [OrderService, OrdersRepository, KafkaProducerService],
  exports: [OrderService],
})
export class OrdersModule {}
