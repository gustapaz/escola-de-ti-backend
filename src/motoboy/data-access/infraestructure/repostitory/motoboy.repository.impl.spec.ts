import { Test, TestingModule } from '@nestjs/testing';
import { MotoboyRepositoryImpl } from './motoboy.repository.impl';
import {
  NotFoundException,
} from '@nestjs/common';

describe('MotoboyRepositoryImpl', () => {
  let repository: MotoboyRepositoryImpl;
  let mockKnex: any;

  beforeEach(async () => {
    mockKnex = {
      knex: jest.fn(),
      insert: jest.fn().mockReturnThis(),
      returning: jest.fn(),
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MotoboyRepositoryImpl,
        {
          provide: 'default_KnexModuleConnectionToken',
          useValue: mockKnex,
        },
      ],
    }).compile();

    repository = module.get<MotoboyRepositoryImpl>(MotoboyRepositoryImpl);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('profile', () => {
    it('should find profile by email', async () => {
      mockKnex.select.mockReturnThis([
        {
          nome: 'João',
          aiqcoins: 0,
        },
      ]);
      mockKnex.where.mockResolvedValueOnce([
        {
          id: '00000000-0000-0000-0000-000000000000',
        },
      ]);
      const motoboy = await repository.profile('joao.almeida@example.com');
      expect(motoboy).toBeDefined();
    });

    it('should throw an NotFoundException if the motoboy profile is not found', async () => {
      mockKnex.select.mockReturnThis();
      mockKnex.where.mockResolvedValueOnce([]);
      await expect(
        repository.profile('joao.almeida@example.com'),
      ).rejects.toThrow(new NotFoundException('Entregador não encontrado'));
    });
  });

  describe('findAll', () => {
    it('should find all motoboys', async () => {
      const motoboys = await repository.findAll();
      expect(motoboys).toBeDefined();
    });
  });

  describe('findById', () => {
    it('should find motoboy by id', async () => {
      mockKnex.select.mockReturnThis([
        {
          email: 'joao.almeida@example.com',
        },
      ]);
      mockKnex.where.mockResolvedValueOnce([
        {
          id: '00000000-0000-0000-0000-000000000000',
        },
      ]);

      const motoboy = await repository.findById(
        '00000000-0000-0000-0000-000000000000',
      );
      expect(motoboy).toBeDefined();
    });

    it('should throw an NotFoundException if the motoboy id is not found', async () => {
      mockKnex.select.mockReturnThis();
      mockKnex.where.mockResolvedValueOnce([]);
      await expect(
        repository.findById('00000000-0000-0000-0000-000000000000'),
      ).rejects.toThrow(new NotFoundException('Entregador não encontrado'));
    });
  });

  describe('findByEmail', () => {
    it('should find motoboy by email', async () => {
      mockKnex.select.mockReturnThis([
        {
          id: '00000000-0000-0000-0000-000000000000',
          email: 'joao.almeida@example.com',
          senha: 'senhaSegura123',
          ativo: true,
        },
      ]);
      mockKnex.where.mockResolvedValueOnce([
        {
          email: 'joao.almeida@example.com',
        },
      ]);
      const motoboy = await repository.findByEmail('joao.almeida@example.com');
      expect(motoboy).toBeDefined();
    });

    it('should throw an NotFoundException if the motoboy email is not found', async () => {
      mockKnex.select.mockReturnThis();
      mockKnex.where.mockResolvedValueOnce([]);
      await expect(
        repository.findByEmail('joao.almeida@example.com'),
      ).rejects.toThrow(new NotFoundException('Entregador não encontrado'));
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
