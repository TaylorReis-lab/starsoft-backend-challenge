import { Test, TestingModule } from '@nestjs/testing'
import { OrdersController } from '../../modules/orders/controller/orders.controller'
import { OrderService } from '../../modules/orders/services/orders.service'

describe('OrdersController', () => {
  let controller: OrdersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrderService],
    }).compile()

    controller = module.get<OrdersController>(OrdersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
