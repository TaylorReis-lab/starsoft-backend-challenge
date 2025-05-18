import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderService } from './services/orders.service'
import { OrdersController } from './controller/orders.controller'
import { Order } from './entities/order.entity'
import { ProductsModule } from '../products/products.module'

@Module({
  imports: [TypeOrmModule.forFeature([Order]), ProductsModule],
  controllers: [OrdersController],
  providers: [OrderService],
})
export class OrdersModule {}
