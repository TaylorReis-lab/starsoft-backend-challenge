import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: ['item1', 'item2'], description: 'Itens do pedido' })
  items: string[];

  @ApiProperty({ example: 250.75, description: 'Preço total do pedido' })
  total: number;
}
