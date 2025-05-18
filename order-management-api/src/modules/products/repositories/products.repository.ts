import { EntityRepository, Repository } from 'typeorm'
import { Product } from '../entities/product.entity'
import { CreateProductDto } from '../dtos/create-product.dto'

@EntityRepository(Product)
export class ProductsRepository extends Repository<Product> {
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { name, description, price, stockQuantity, category } =
      createProductDto

    const product = this.create({
      name,
      description,
      price,
      stockQuantity,
      category,
      isActive: true,
    })

    return this.save(product)
  }
}
