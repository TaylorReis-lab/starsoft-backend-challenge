import { 
  IsUUID, 
  IsNumber, 
  IsPositive, 
  IsString, 
  IsOptional,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsUUID(4, { message: 'ID do produto deve ser um UUID válido' })
  productId: string;

  @IsNumber({}, { message: 'Preço unitário deve ser um número' })
  @IsPositive({ message: 'Preço unitário deve ser positivo' })
  unitPrice: number;

  @IsNumber({}, { message: 'Quantidade deve ser um número' })
  @IsPositive({ message: 'Quantidade deve ser positiva' })
  quantity: number;

  @IsString()
  @IsOptional()
  notes?: string;
}