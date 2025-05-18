import {
  Controller,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { OrderItemService } from '../services/order-item.service'
import { UpdateOrderItemDto } from '../dtos/update-order.dto'

@ApiTags('Order Items')
@Controller('order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Update order item' })
  @ApiParam({ name: 'id', description: 'Order item ID' })
  @ApiResponse({ status: 200, description: 'Item updated' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async updateItem(
    @Param('id') itemId: string,
    @Body() updateDto: UpdateOrderItemDto,
  ) {
    return this.orderItemService.updateItem(itemId, updateDto)
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove item from order' })
  @ApiParam({ name: 'id', description: 'Order item ID' })
  @ApiResponse({ status: 204, description: 'Item removed' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async removeItem(@Param('id') itemId: string) {
    await this.orderItemService.removeItem(itemId)
  }
}
