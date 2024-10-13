import { CreateItemCarrinhoDto } from "../dto/create-item-carrinho.dto";
import { ItemCarrinho } from "../entities/item-carrinho.entity";

export abstract class ItemCarrinhoRepository {
    abstract create(input: CreateItemCarrinhoDto): Promise<ItemCarrinho>;
    abstract findAllById(idCarrinho: string): Promise<ItemCarrinho[]>;
}