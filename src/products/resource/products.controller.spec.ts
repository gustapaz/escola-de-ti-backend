import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { CreateProductsUseCase } from '../domain/service/create-products.use-case';
import { ProductRepository } from '../domain/repository/products.repository';
import { CloudinaryModule } from '../../cloudinary/resource/cloudinary.module';
import { CloudinaryUseCase } from '../../cloudinary/domain/service/cloudinary.use-case';
import { CloudinaryProvider } from '../../cloudinary/data-access/infraestructure/storage/cloudinary.provider';
import { ICloudinaryProvider } from '../../cloudinary/domain/interfaces/icloudinary.provider';
import { ProductRepositoryImpl } from '../data-access/infraestructure/repository/products.repository.impl';
import { ProductsModule } from './products.module';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { UpdateProductsUseCase } from '../domain/service/update-products.use-case';
import { DeleteProductsUseCase } from '../domain/service/delete-products.use-case';
import { FindAllProductsUseCase } from '../domain/service/find-all-products.use-case';
import { FindByIdProductsUseCase } from '../domain/service/find-by-id-products.use-case';
import { ImagensModule } from '../../imagens/resource/imagens.module';
import { StockModule } from '../../stock/resource/stock.module';
import {
  IMAGEN_CREATE_PROVIDER,
  IMAGEN_DELETE_PROVIDER,
  IMAGEN_FIND_BY_ID_PROVIDER,
  IMAGEN_UPDATE_PROVIDER,
  STOCK_CREATE_PROVIDER,
  STOCK_DELETE_PROVIDER,
  STOCK_FIND_BY_ID_PROVIDER,
  STOCK_UPDATE_PROVIDER,
} from '../../shared/constants/injection-tokens';
import { CreateImagenUseCase } from '../../imagens/domain/service/create-imagem.use-case';
import { CreateStockUseCase } from '../../stock/domain/service/create-stock.use-case';
import { ImagemRepository } from '../../imagens/domain/repository/imagem.repository';
import { ImagemRepositoryImpl } from '../../imagens/data-access/infraestructure/repository/imagem.repository.impl';
import { StockRepository } from '../../stock/domain/repository/stock.repository';
import { StockRepositoryImpl } from '../../stock/data-access/infraestructure/repository/stock.repository.impl';
import { FindByIdStockUseCase } from '../../stock/domain/service/find-by-id-stock.use-case';
import { FindByIdImagemUseCase } from '../../imagens/domain/service/find-by-id-imagem.use-case';
import { DeleteImagensUseCase } from '../../imagens/domain/service/delete-imagem.use-case';
import { DeleteStockUseCase } from '../../stock/domain/service/delete-stock.use-case';
import { UpdateImagemUseCase } from '../../imagens/domain/service/update-imagem.use-case';
import { UpdateStockUseCase } from '../../stock/domain/service/update-stock.use-case';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let id: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ProductsModule,
        CloudinaryModule,
        ImagensModule,
        StockModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        KnexModule.forRoot({
          config: {
            client: 'postgresql',
            useNullAsDefault: true,
            connection: {
              connectionString: process.env.TEST_DATABASE_URL,
              ssl: { rejectUnauthorized: false },
              host: process.env.TEST_HOST,
              port: 5432,
              user: process.env.TEST_USER,
              database: process.env.TEST_DATABASE,
              password: process.env.TEST_PASSWORD,
            },
          },
        }),
      ],
      controllers: [ProductsController],
      providers: [
        CreateProductsUseCase,
        UpdateProductsUseCase,
        DeleteProductsUseCase,
        FindAllProductsUseCase,
        FindByIdProductsUseCase,
        CloudinaryUseCase,
        {
          provide: ProductRepository,
          useClass: ProductRepositoryImpl,
        },
        {
          provide: ICloudinaryProvider,
          useClass: CloudinaryProvider,
        },
        {
          provide: ImagemRepository,
          useClass: ImagemRepositoryImpl,
        },
        {
          provide: StockRepository,
          useClass: StockRepositoryImpl,
        },
        {
          provide: IMAGEN_CREATE_PROVIDER,
          useClass: CreateImagenUseCase,
        },
        {
          provide: STOCK_CREATE_PROVIDER,
          useClass: CreateStockUseCase,
        },
        {
          provide: STOCK_FIND_BY_ID_PROVIDER,
          useClass: FindByIdStockUseCase,
        },
        {
          provide: IMAGEN_FIND_BY_ID_PROVIDER,
          useClass: FindByIdImagemUseCase,
        },
        {
          provide: IMAGEN_DELETE_PROVIDER,
          useClass: DeleteImagensUseCase,
        },
        {
          provide: STOCK_DELETE_PROVIDER,
          useClass: DeleteStockUseCase,
        },
        {
          provide: IMAGEN_UPDATE_PROVIDER,
          useClass: UpdateImagemUseCase,
        },
        {
          provide: STOCK_UPDATE_PROVIDER,
          useClass: UpdateStockUseCase,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a product', async () => {
    const createProductDto = {
      nome: 'Garrafinha',
      descricao: 'garrafinha de agua',
      valor: 2,
      quantidade: 500,
    };

    const response = await request(app.getHttpServer())
      .post('/products')
      .field('nome', createProductDto.nome)
      .field('valor', createProductDto.valor)
      .field('descricao', createProductDto.descricao)
      .field('quantidade', createProductDto.quantidade)
      .attach('image', 'test/assets/products/garrafinha-aiqfome.png'/* 'test/assets/products/bag-aiqfome.png' */);

    id = response.body.id;
    expect(response.status).toBe(201);
  }, 10000);

  it('should find all products', async () => {
    const response = await request(app.getHttpServer()).get('/products');

    expect(response.status).toBe(200);
  }, 10000);

  it('should find a product by id', async () => {
    const response = await request(app.getHttpServer()).get(`/products/${id}`);

    expect(response.status).toBe(200);
  }, 10000);

  it('should update a product', async () => {
    const updateProductDto = {
      nome: 'atualizado',
      descricao: 'descricao atualizada',
      valor: 1000,
      quantidade: 20,
    };

    const response = await request(app.getHttpServer())
      .patch(`/products/${id}`)
      .field('nome', updateProductDto.nome)
      .field('valor', updateProductDto.valor)
      .field('descricao', updateProductDto.descricao)
      .field('quantidade', updateProductDto.quantidade)
      /*    .field('status', updateProductDto.status) */
      .attach('image', 'test/assets/products/bag-aiqfome.png');

    expect(response.status).toBe(200);
  }, 10000);

  it('should delete a product', async () => {
    const response = await request(app.getHttpServer()).delete(
      `/products/${id}`,
    );

    expect(response.status).toBe(200);
  }, 10000);
});
