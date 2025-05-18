import { 
  IsString, 
  IsNumber, 
  IsPositive, 
  IsOptional, 
  Length, 
  IsBoolean 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Smartphone', description: 'Product name' })
  @IsString()
  @Length(3, 100)
  name: string;

  @ApiProperty({ example: 'Latest model with advanced features', description: 'Product description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 999.99, description: 'Product price' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 50, description: 'Available quantity in stock' })
  @IsNumber()
  @IsPositive()
  stockQuantity: number;

  @ApiProperty({ example: 'Electronics', required: false })
  @IsString()
  @IsOptional()
  @Length(3, 50)
  category?: string;

  @ApiProperty({ example: true, required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}