import { ApiProperty } from '@nestjs/swagger'

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'ID do cliente' })
  customerId: number

  @ApiProperty({ example: 'pending', description: 'Status do pedido' })
  status: string

  @ApiProperty({
    example: [{ productId: 1, quantity: 2, unitPrice: 50.5 }],
    description: 'Itens do pedido',
  })
  items: Array<{ productId: number; quantity: number; unitPrice: number }>
}
