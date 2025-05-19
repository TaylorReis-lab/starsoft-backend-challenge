import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderService } from './services/orders.service'
import { OrdersController } from './controller/orders.controller'
import { Order } from './entities/order.entity'
import { OrdersRepository } from './orders.repository'
import { KafkaProducerService } from '@kafka/kafka-producer.service'
import { KafkaModule } from '@kafka/kafka.module'

@Module({
  imports: [TypeOrmModule.forFeature([Order]), KafkaModule],
  controllers: [OrdersController],
  providers: [OrderService, OrdersRepository, KafkaProducerService],
  exports: [OrderService],
})
export class OrdersModule {}
