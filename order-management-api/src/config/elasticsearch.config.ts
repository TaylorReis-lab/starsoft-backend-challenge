import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch'
import { ConfigService } from '@nestjs/config'

export const getElasticsearchConfig = (configService: ConfigService): ElasticsearchModuleOptions => {
  const node = configService.get('ELASTICSEARCH_NODE');
  if (!node) {
    throw new Error('ELASTICSEARCH_NODE is not defined in config');
  }
  
  return {
    node,
    auth: {
      username: configService.get('ELASTICSEARCH_USER') || 'elastic',
      password: configService.get('ELASTICSEARCH_PASSWORD') || 'changeme',
    },
    maxRetries: 3,
    requestTimeout: 10000,
  };
};
