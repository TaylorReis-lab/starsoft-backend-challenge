import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { OrderItemService } from '../../modules/orders/services/order-item.service';

@ValidatorConstraint({ name: 'OrderItemExists', async: true })
@Injectable()
export class OrderItemExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly orderItemService: OrderItemService) {}

  async validate(id: string): Promise<boolean> {
    try {
      await this.orderItemService.getItem(id);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `Order item with ID ${args.value} does not exist`;
  }
}