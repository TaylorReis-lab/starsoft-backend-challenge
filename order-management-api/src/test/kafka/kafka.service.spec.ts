import { Test, TestingModule } from '@nestjs/testing'
import { KafkaNotificationService } from '../../modules/notifications/services/kafka-notification.service'

// Mock do Producer Kafka
const mockKafkaProducer = {
  send: jest.fn(),
}

describe('KafkaNotificationService', () => {
  let service: KafkaNotificationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaNotificationService,
        {
          provide: 'KafkaProducer', // ou o token usado na injeção
          useValue: mockKafkaProducer,
        },
      ],
    }).compile()

    service = module.get<KafkaNotificationService>(KafkaNotificationService)
    mockKafkaProducer.send.mockClear()
  })

  it('should send a product notification to Kafka', async () => {
    const product = { id: '123', name: 'Produto Teste', price: 100 }

    await service.notifyProductCreated(product)

    expect(mockKafkaProducer.send).toHaveBeenCalledWith({
      topic: 'product-notifications',
      messages: [
        {
          key: product.id,
          value: JSON.stringify(product),
        },
      ],
    })
  })

  it('should throw if kafkaProducer.send throws', async () => {
    mockKafkaProducer.send.mockRejectedValueOnce(new Error('Kafka error'))

    await expect(
      service.notifyProductCreated({
        id: '123',
        name: 'Produto Teste',
        price: 100,
      }),
    ).rejects.toThrow('Kafka error')
  })
})
