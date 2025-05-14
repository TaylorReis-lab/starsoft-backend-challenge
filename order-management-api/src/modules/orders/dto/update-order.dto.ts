import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty({ example: 'enviado', description: 'Novo status do pedido' })
  status: string;
}
