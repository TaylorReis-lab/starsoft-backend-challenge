import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ElasticsearchService as NestElasticsearchService } from '@nestjs/elasticsearch'
import { Order } from '../../orders/entities/order.entity'
import { OrderStatus } from '../../orders/enums/order-status.enum'
import { IndicesCreateRequest } from '@elastic/elasticsearch/lib/api/types'

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private readonly logger = new Logger(ElasticsearchService.name)
  private readonly indexName = 'orders'

  constructor(
    private readonly elasticsearchService: NestElasticsearchService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.initializeIndex()
  }

  private async initializeIndex(): Promise<void> {
    try {
      const indexExists = await this.elasticsearchService.indices.exists({
        index: this.indexName,
      })

      if (!indexExists) {
        const createRequest: IndicesCreateRequest = {
          index: this.indexName,
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0,
          },
          mappings: {
            properties: {
              id: { type: 'keyword' },
              status: { type: 'keyword' },
              total: { type: 'double' },
              customerId: { type: 'keyword' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
              items: {
                type: 'nested',
                properties: {
                  productId: { type: 'keyword' },
                  name: { type: 'text' },
                  quantity: { type: 'integer' },
                  price: { type: 'double' },
                },
              },
            },
          },
        }

        await this.elasticsearchService.indices.create(createRequest)
        this.logger.log(`Index "${this.indexName}" created successfully.`)
      }
    } catch (error) {
      this.logger.error(`Failed to initialize index: ${error.message}`)
      throw error
    }
  }

  private getIndexMappings() {
    return {
      properties: {
        id: { type: 'keyword' },
        status: { type: 'keyword' },
        total: { type: 'double' },
        customerId: { type: 'keyword' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' },
        items: {
          type: 'nested',
          properties: {
            productId: { type: 'keyword' },
            name: { type: 'text' },
            quantity: { type: 'integer' },
            price: { type: 'double' },
          },
        },
      },
    }
  }

  async indexOrder(order: Order): Promise<void> {
    try {
      await this.elasticsearchService.index({
        index: this.indexName,
        id: order.id.toString(),
        document: this.transformOrderToDocument(order),
      })
    } catch (error) {
      this.logger.error(`Failed to index order ${order.id}: ${error.message}`)
      throw error
    }
  }

  private transformOrderToDocument(order: Order) {
    return {
      id: order.id,
      status: order.status,
      total: order.total,
      customerId: order.customerId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items?.map((item) => ({
        productId:
          typeof item.product === 'object' ? item.product.id : item.product,
        name: typeof item.product === 'object' ? item.product.name : '',
        quantity: item.quantity,
        price: item.price,
      })),
    }
  }

  async searchOrders(params: {
    status?: OrderStatus
    customerId?: string
    fromDate?: Date
    toDate?: Date
    minTotal?: number
    maxTotal?: number
  }): Promise<Order[]> {
    try {
      const { hits } = await this.elasticsearchService.search<Order>({
        index: this.indexName,
        query: this.buildSearchQuery(params),
      })

      return hits.hits.map((hit) => hit._source as Order)
    } catch (error) {
      this.logger.error(`Search failed: ${error.message}`)
      throw error
    }
  }

  private buildSearchQuery(params: {
    status?: OrderStatus
    customerId?: string
    fromDate?: Date
    toDate?: Date
    minTotal?: number
    maxTotal?: number
  }) {
    const must: any[] = []

    if (params.status) {
      must.push({ term: { status: params.status } })
    }

    if (params.customerId) {
      must.push({ term: { customerId: params.customerId } })
    }

    if (params.fromDate || params.toDate) {
      const range: Record<string, any> = {}
      if (params.fromDate) range.gte = params.fromDate
      if (params.toDate) range.lte = params.toDate
      must.push({ range: { createdAt: range } })
    }

    if (params.minTotal !== undefined || params.maxTotal !== undefined) {
      const range: Record<string, any> = {}
      if (params.minTotal !== undefined) range.gte = params.minTotal
      if (params.maxTotal !== undefined) range.lte = params.maxTotal
      must.push({ range: { total: range } })
    }

    return must.length > 0 ? { bool: { must } } : { match_all: {} }
  }

  async removeOrderFromIndex(orderId: string): Promise<void> {
    try {
      await this.elasticsearchService.delete({
        index: this.indexName,
        id: orderId,
      })
      this.logger.log(`Order ${orderId} removed from index`)
    } catch (error) {
      const notFound =
        error.meta?.body?.error?.type === 'document_missing_exception'
      if (notFound) {
        this.logger.log(`Order ${orderId} not found in index`)
      } else {
        this.logger.error(`Failed to remove order ${orderId}: ${error.message}`)
        throw error
      }
    }
  }
}
