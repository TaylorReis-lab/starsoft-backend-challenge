import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch'
import { ConfigService } from '@nestjs/config'

export const getElasticsearchConfig = (
  configService: ConfigService,
): ElasticsearchModuleOptions => ({
  node: configService.get('ELASTICSEARCH_NODE'),
  maxRetries: 3,
  requestTimeout: 10000,
})
