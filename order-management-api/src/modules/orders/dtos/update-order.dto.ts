import { 
  IsUUID, 
  IsNumber, 
  IsPositive, 
  IsString, 
  IsOptional,
  Validate,
  MaxLength,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemExistsValidator } from '../../../common/validators/order-item.validator';

export class UpdateOrderItemDto {
  status(orderId: string, status: any) {
    throw new Error('Method not implemented.');
  }
  @IsUUID(4, { message: 'ID do item deve ser um UUID válido' })
  @Validate(OrderItemExistsValidator)
  id: string;

  @IsOptional()
  @IsNumber({}, { message: 'Quantidade deve ser um número' })
  @IsPositive({ message: 'Quantidade deve ser positiva' })
  @Min(1, { message: 'Quantidade mínima é 1' })
  @Type(() => Number)
  quantity?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Observação não pode exceder 500 caracteres' })
  notes?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Preço unitário deve ser um número' })
  @IsPositive({ message: 'Preço unitário deve ser positivo' })
  @Type(() => Number)
  unitPrice?: number;
}