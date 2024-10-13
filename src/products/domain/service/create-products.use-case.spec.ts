import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductsUseCase } from './create-products.use-case';
import { CloudinaryUseCase } from '../../../cloudinary/domain/service/cloudinary.use-case';
import { ProductRepository } from '../repository/products.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { ICreate } from '../../../shared/interfaces/create.interface';
import { CreateImagenDto } from '../../../imagens/domain/dto/create-imagen.dto';
import { Imagen } from '../../../imagens/domain/entities/imagen.entity';
import {
  IMAGEN_CREATE_PROVIDER,
  STOCK_CREATE_PROVIDER,
} from '../../../shared/constants/injection-tokens';
import { CreateStockDto } from '../../../stock/domain/dto/create-stock.dto';
import { Stock } from '../../../stock/domain/entities/stock.entity';

describe('CreateProductsUseCase', () => {
  let service: CreateProductsUseCase;
  let mockCloudinaryUseCase: jest.Mocked<CloudinaryUseCase>;
  let mockProductRepository: jest.Mocked<ProductRepository>;

  beforeEach(async () => {
    mockCloudinaryUseCase = {
      uploadImage: jest.fn(),
      cloudinaryProvider: {} as any,
    } as unknown as jest.Mocked<CloudinaryUseCase>;

    mockProductRepository = {
      create: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    const mockImageCreateProvider = {
      create: jest.fn(),
    } as unknown as jest.Mocked<ICreate<CreateImagenDto, Imagen>>;

    const mcockStockCreateProvider = {
      create: jest.fn(),
    } as unknown as jest.Mocked<ICreate<CreateStockDto, Stock>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductsUseCase,
        {
          provide: CloudinaryUseCase,
          useValue: mockCloudinaryUseCase,
        },
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
        {
          provide: IMAGEN_CREATE_PROVIDER,
          useValue: mockImageCreateProvider,
        },
        {
          provide: STOCK_CREATE_PROVIDER,
          useValue: mcockStockCreateProvider,
        },
      ],
    }).compile();

    service = module.get<CreateProductsUseCase>(CreateProductsUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockProductRepository.create.mockRejectedValue(new Error('Fake error'));

    await expect(service.create({} as any, {} as any)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
