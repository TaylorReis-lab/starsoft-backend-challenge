import { Entity, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { CreateOrderItemDto } from '../dtos/create-order.dto';
import { Product } from '@modules/products/entities/product.entity';

@Entity()
export class Order {
  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    eager: true 
  })
  items: OrderItem[];
    total: any;
    customerId: any;
    createdAt: any;
    id: any;
    status: any;
    updatedAt: any;

  // Método para adicionar item ao pedido
  addItem(itemDto: CreateOrderItemDto): OrderItem {
    const item = new OrderItem();
    item.product = { id: itemDto.productId } as Product;
    item.unitPrice = itemDto.unitPrice;
    item.quantity = itemDto.quantity;
    item.notes = itemDto.notes || null;
    item.calculateTotal();

    if (!this.items) {
      this.items = [];
    }
    this.items.push(item);

    return item;
  }
}