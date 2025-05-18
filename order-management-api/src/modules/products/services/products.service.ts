import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Injectable()
export class ProductsService {
  remove(id: string) {
      throw new Error('Method not implemented.');
  }
  update(id: string, updateProductDto: UpdateProductDto): Product | PromiseLike<Product> {
      throw new Error('Method not implemented.');
  }
  findOne(id: string): Product | PromiseLike<Product> {
      throw new Error('Method not implemented.');
  }
  create(createProductDto: CreateProductDto): Product | PromiseLike<Product> {
      throw new Error('Method not implemented.');
  }
  findAll(category: string | undefined): Product[] | PromiseLike<Product[]> {
      throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ 
      where: { id },
      relations: ['orderItems']
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async decreaseStock(productId: string, quantity: number): Promise<void> {
    await this.productRepository.decrement(
      { id: productId },
      'stockQuantity',
      quantity
    );
  }
}

export { Product };
