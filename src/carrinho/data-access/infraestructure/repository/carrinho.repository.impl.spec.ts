import { Test, TestingModule } from '@nestjs/testing';
import { CarrinhoRepositoryImpl } from './carrinho.repository.impl';

describe('CarrinhoRepositoryImpl', () => {
    let repository: CarrinhoRepositoryImpl;
    let mockKnex: any;
    
    beforeEach(async () => {
        mockKnex = {
        insert: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([]),
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
        update: jest.fn().mockReturnThis(),
        };
    
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            CarrinhoRepositoryImpl,
            {
            provide: 'default_KnexModuleConnectionToken',
            useValue: mockKnex,
            },
        ],
        }).compile();
    
        repository = module.get<CarrinhoRepositoryImpl>(
        CarrinhoRepositoryImpl,
        );
    });
    
    it('should be defined', () => {
        expect(repository).toBeDefined();
    });
    
    it('should create a new cart', async () => {
        const id_motoboy = '123';
        await repository.create(id_motoboy);
        expect(mockKnex.from).toHaveBeenCalledWith('carrinho');
        expect(mockKnex.insert).toHaveBeenCalledWith({
        id_entregador: id_motoboy,
        valor: 0,
        data_de_compra: expect.any(String),
        });
        expect(mockKnex.returning).toHaveBeenCalledWith('*');
    });
    
    it('should add a new cart', async () => {
        mockKnex.where.mockReturnThis();
        mockKnex.select.mockResolvedValue([])
        const id = '123';
        const input = {
        valor: 0,
        status: true,
        };
        await repository.addCarrinho(id, input);
        expect(mockKnex.update).toHaveBeenCalledWith(input);
        expect(mockKnex.where).toHaveBeenCalledWith({ id });
        expect(mockKnex.returning).toHaveBeenCalledWith('*');
    });
    
    it('should find a cart by id', async () => {
        const id = '123';
        await repository.findById(id);
        expect(mockKnex.from).toHaveBeenCalledWith('carrinho');
        expect(mockKnex.select).toHaveBeenCalledWith('*');
        expect(mockKnex.where).toHaveBeenCalledWith({ id });
    });
    
    it('should find a cart by id_motoboy', async () => {
        const id = '123';
        await repository.findByIdMotoboy(id);
        expect(mockKnex.from).toHaveBeenCalledWith('carrinho');
        expect(mockKnex.select).toHaveBeenCalledWith('*');
        expect(mockKnex.where).toHaveBeenCalledWith({ id_entregador: id, status: true });
    });
});