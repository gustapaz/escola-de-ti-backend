import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProductDto } from '../dto/update-product.dto';
import { CloudinaryUseCase } from '../../../cloudinary/domain/service/cloudinary.use-case';
import { ProductRepository } from '../repository/products.repository';
import { IUpdate } from '../../../shared/interfaces/update.interface';
import { UpdateImagenDto } from '../../../imagens/domain/dto/update-imagen.dto';
import { Imagen } from '../../../imagens/domain/entities/imagen.entity';
import { UpdateStockDto } from '../../../stock/domain/dto/update-stock.dto';
import { Stock } from '../../../stock/domain/entities/stock.entity';
import {
  IMAGEN_UPDATE_PROVIDER,
  STOCK_UPDATE_PROVIDER,
} from '../../../shared/constants/injection-tokens';
import { UpdateProductsUseCase } from './update-products.use-case';	

describe('UpdateProductsUseCase', () => {
  let service: UpdateProductsUseCase;
  let mockCloudinaryUseCase: jest.Mocked<CloudinaryUseCase>;
  let mockProductRepository: jest.Mocked<ProductRepository>;

  beforeEach(async () => {
    mockCloudinaryUseCase = {
      uploadImage: jest.fn(),
      cloudinaryProvider: {} as any,
    } as unknown as jest.Mocked<CloudinaryUseCase>;

    mockProductRepository = {
      update: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    const mockImageUpdateProvider = {
      update: jest.fn(),
    } as unknown as jest.Mocked<IUpdate<UpdateImagenDto, Imagen>>;

    const mcockStockUpdateProvider = {
      update: jest.fn(),
    } as unknown as jest.Mocked<IUpdate<UpdateStockDto, Stock>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProductsUseCase,
        {
          provide: CloudinaryUseCase,
          useValue: mockCloudinaryUseCase,
        },
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
        {
          provide: IMAGEN_UPDATE_PROVIDER,
          useValue: mockImageUpdateProvider,
        },
        {
          provide: STOCK_UPDATE_PROVIDER,
          useValue: mcockStockUpdateProvider,
        },
      ],
    }).compile();

    service = module.get<UpdateProductsUseCase>(UpdateProductsUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockProductRepository.update.mockRejectedValue(new Error());

    await expect(
      service.update('1', {} as UpdateProductDto, {} as Express.Multer.File),
    ).rejects.toThrowError();
  });
});