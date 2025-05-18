import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@nestjs/microservices';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { getTypeOrmConfig } from './config/typeorm.config';
import { getKafkaConfig } from './config/kafka.config';
import { getElasticsearchConfig } from './config/elasticsearch.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: getKafkaConfig,
      },
    ]),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getElasticsearchConfig,
    }),
  ],
})
export class AppModule {}