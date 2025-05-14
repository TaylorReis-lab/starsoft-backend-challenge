import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdersModule } from "./modules/orders/orders.module";
import { Module } from "@nestjs/common/decorators/modules/module.decorator";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'orders',
      autoLoadEntities: true,
      synchronize: true,
    }),
    OrdersModule,
  ],
})
export class AppModule {}
