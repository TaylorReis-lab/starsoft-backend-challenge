import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Order } from './order.entity'
import { Product } from '../../products/services/products.service'

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE', // Remove o item se o pedido for deletado
  })
  @JoinColumn({ name: 'order_id' })
  order: Order

  @ManyToOne(() => Product, {
    eager: true, // Carrega automaticamente os dados do produto
    nullable: false,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'Preço unitário no momento da compra',
  })
  unitPrice: number

  @Column({
    type: 'integer',
    comment: 'Quantidade de itens',
  })
  quantity: number

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'Preço total (unitPrice * quantity)',
  })
  totalPrice: number

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Observações sobre o item',
  })
  notes: string | null
  name: any
  price: any

  // Método para calcular o preço total
  calculateTotal(): void {
    this.totalPrice = this.unitPrice * this.quantity
  }
}
