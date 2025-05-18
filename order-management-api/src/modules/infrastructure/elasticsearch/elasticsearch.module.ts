import { Module } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Module({
  providers: [
    {
      provide: Client,
      useFactory: () => {
        return new Client({ node: 'http://localhost:9200' }); // Ajuste a URL se necessário
      },
    },
  ],
  exports: [Client],
})
export class ElasticsearchModule {}
