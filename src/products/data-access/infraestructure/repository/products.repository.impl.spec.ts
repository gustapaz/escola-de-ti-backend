import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepositoryImpl } from './products.repository.impl';

describe('ProductRepositoryImpl', () => {
  let repository: ProductRepositoryImpl;
  let mockKnex: any;

  beforeEach(async () => {
    mockKnex = {
      insert: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([]),
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockReturnThis(),
      del: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepositoryImpl,
        {
          provide: 'default_KnexModuleConnectionToken',
          useValue: mockKnex,
        },
      ],
    }).compile();

    repository = module.get<ProductRepositoryImpl>(ProductRepositoryImpl);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create a new product', async () => {
    const input = {
      nome: 'name',
      descricao: 'description',
      valor: 10,
      quantidade: 10,
      image: 'image',
    };
    await repository.create(input);
    expect(mockKnex.from).toHaveBeenCalledWith('produto');
    expect(mockKnex.insert).toHaveBeenCalledWith(input);
    expect(mockKnex.returning).toHaveBeenCalledWith('*');
  });

  it('should get all products', async () => {
    await repository.findAll();
    expect(mockKnex.from).toHaveBeenCalledWith('produto');
    expect(mockKnex.select).toHaveBeenCalledWith('*');
  });

  it('should get product by id', async () => {
    await repository.findById('123');
    expect(mockKnex.from).toHaveBeenCalledWith('produto');
    expect(mockKnex.select).toHaveBeenCalledWith('*');
    expect(mockKnex.where).toHaveBeenCalledWith({ id: '123' });
  });

  it('should update product by id', async () => {
    mockKnex.where.mockReturnThis();
    const input = {
      nome: 'name',
      descricao: 'description',
      valor: 10,
      status: true,
    };
    await repository.update('123', input);
    expect(mockKnex.update).toHaveBeenCalledWith({
        nome: input.nome,
        descricao : input.descricao,
        valor: input.valor,
        status: input.status,
    });
    expect(mockKnex.where).toHaveBeenCalledWith({ id: '123' });
    expect(mockKnex.returning).toHaveBeenCalledWith('*');
  });

  it('should delete product by id', async () => {
    mockKnex.from.mockReturnThis();
    mockKnex.where.mockReturnThis();
    mockKnex.del.mockResolvedValueOnce(1);

    await repository.delete('123');
    expect(mockKnex.from).toHaveBeenCalledWith('produto');
    expect(mockKnex.where).toHaveBeenCalledWith({ id: '123' });
    expect(mockKnex.del).toHaveBeenCalled();
  });
});
