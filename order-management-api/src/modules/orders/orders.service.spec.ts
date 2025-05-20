import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { OrderEntity, OrderStatus } from './entities/order.entity'
import { OrderService } from './services/orders.service'
import { OrderItem } from './entities/order-item.entity'

describe('OrdersService', () => {
  let service: OrderService
  let orderRepository: Repository<OrderEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
          },
        },
      ],
    }).compile()

    service = module.get<OrderService>(OrderService)
    orderRepository = module.get<Repository<OrderEntity>>(getRepositoryToken(OrderEntity))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should find an order by id', async () => {
    const mockOrder: OrderEntity = {
      id: '1',
      status: OrderStatus.PENDING,
      total: 100,
      customerId: 'customer-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        {
          productId: 'product-1',
          unitPrice: 50,
          quantity: 2,
          notes: 'Test note',
        } as unknown as OrderItem,
      ],
      addItem: jest.fn(),
    } as any

    jest.spyOn(orderRepository, 'findOne').mockResolvedValue(mockOrder)

    const order = await service.findOne('1')
    expect(order).toEqual(mockOrder)
    expect(orderRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
      relations: ['items'],
    })
  })
})
