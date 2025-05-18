import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderService } from './services/orders.service'
import { OrdersController } from './controller/orders.controller'
import { Order } from './entities/order.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [OrdersController],
  providers: [OrderService],
})
export class OrdersModule {}
