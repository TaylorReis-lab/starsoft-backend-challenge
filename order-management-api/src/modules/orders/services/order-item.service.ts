import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../entities/order-item.entity';
import { UpdateOrderItemDto } from '../dtos/update-order.dto';

@Injectable()
export class OrderItemService {
  getItem(id: string) {
      throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async updateItem(
    itemId: string, 
    updateDto: UpdateOrderItemDto
  ): Promise<OrderItem> {
    const item = await this.orderItemRepository.findOneBy({ id: itemId });
    
    if (!item) {
      throw new Error('Item não encontrado');
    }

    if (updateDto.quantity !== undefined) {
      item.quantity = updateDto.quantity;
    }

    if (updateDto.notes !== undefined) {
      item.notes = updateDto.notes;
    }

    item.calculateTotal();
    return this.orderItemRepository.save(item);
  }

  async removeItem(itemId: string): Promise<void> {
    await this.orderItemRepository.delete(itemId);
  }
}