import {
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { OrderItem } from './order-item.entity'
import { CreateOrderItemDto } from '../dtos/create-order.dto'
import { Product } from '@modules/products/entities/product.entity'

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  customerId: number

  @Column('decimal', { precision: 10, scale: 2 })
  total: number

  @Column()
  status: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItem[]

  addItem(itemDto: CreateOrderItemDto): OrderItem {
    const item = new OrderItem()
    item.product = { id: itemDto.productId } as Product
    item.unitPrice = itemDto.unitPrice
    item.quantity = itemDto.quantity
    item.notes = itemDto.notes || null
    item.calculateTotal()

    if (!this.items) {
      this.items = []
    }
    this.items.push(item)

    return item
  }
}
