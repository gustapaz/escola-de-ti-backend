import { CampaignModule } from './campanha/resource/campaign.module';
import { ObjectiveModule } from './objetivo/resource/objective.module';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import { AuthModule } from './auth/resource/auth.module';
import { SmsPhoneMiddleware } from './shared/middleware/sms-phone.middleware';
import { ConfigModule } from '@nestjs/config';
import { MetaModule } from './meta/resource/meta.module';
import { MotoboyModule } from './motoboy/resource/motoboy.module';
import { ProductsModule } from './products/resource/products.module';
import { CloudinaryModule } from './cloudinary/resource/cloudinary.module';
import { ImagensModule } from './imagens/resource/imagens.module';
import { StockModule } from './stock/resource/stock.module';
import { CarrinhoModule } from './carrinho/resource/carrinho.module';
import { ItemCarrinhoModule } from './item-carrinho/resource/item-carrinho.module';
import { SubscribeModule } from './inscrito/resource/subscribe.module';


@Module({
  imports: [
    AuthModule,
    CloudinaryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    KnexModule.forRoot({
      config: {
        client: 'postgresql',
        useNullAsDefault: true,
        connection: {
          connectionString: process.env.CONNECTION_STRING,
          ssl: { rejectUnauthorized: false },
          host: process.env.HOST,
          port: 5432,
          user: process.env.USER,
          database: process.env.DATABASE,
          password: process.env.PASSWORD,
        },
      },
    }),
    CampaignModule,
    ObjectiveModule,
    MetaModule,
    SubscribeModule,
    MotoboyModule,
    ProductsModule,
    ImagensModule,
    StockModule,
    CarrinhoModule,
    ItemCarrinhoModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SmsPhoneMiddleware)
      .forRoutes({ path: 'auth/register', method: RequestMethod.POST });
  }
}
