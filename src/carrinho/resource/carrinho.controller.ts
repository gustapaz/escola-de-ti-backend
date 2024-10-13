import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { AddCarrinhoDto } from '../domain/dto/add-carrinho.dto';
import { AddCarrinhoUseCase } from '../domain/service/add-carrinho.use-case';
import { DeleteCarrinhoUseCase } from '../domain/service/delete-carrinho.use-case';
import { DeleteItemCarrinhoUseCase } from '../domain/service/delete-item-carrinho.use-case';
import { FindItensCarrinhoUseCase } from '../domain/service/find-item-by-id-carrinho.use-case';
import { FinishCompraCarrinhoUseCase } from '../domain/service/finish-compra-carrinho.use-case';

@Controller('carrinho')
export class CarrinhoController {
  constructor(
    private readonly addCarrinhoUseCase: AddCarrinhoUseCase,
    private readonly findItensCarrinhoUseCase: FindItensCarrinhoUseCase,
    private readonly finishCompraCarrinhoUseCase: FinishCompraCarrinhoUseCase,
    private readonly deleteCarrrinhoUseCase: DeleteCarrinhoUseCase,
    private readonly deleteItemCarrinhoUseCase: DeleteItemCarrinhoUseCase,
  ) { }

  @Get('itens')
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Encontrar itens no carrinho', description: 'Recupera os itens presentes no carrinho do usuário autenticado.' })
  @ApiResponse({ status: 200, description: 'Lista de itens no carrinho.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  findItensCarrinho(@Req() req: Request) {
    const id_motoboy = req['user'].sub;
    return this.findItensCarrinhoUseCase.findById(id_motoboy);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Limpar carrinho', description: 'Limpa um carrinho pelo seu ID.' })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Item não encontrado.' })
  remove(@Param('id') id: string) {
    return this.deleteCarrrinhoUseCase.delete(id);
  }

  @Delete('itens/:id_itens')
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Remover item específico do carrinho', description: 'Remove um item específico do carrinho com base no ID do item e do usuário autenticado.' })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Item não encontrado.' })
  removeItem(@Req() req: Request, @Param('id_itens') id_itens: string) {
    const id_motoboy = req['user'].sub;
    return this.deleteItemCarrinhoUseCase.deleteItensCarrinho(id_itens, id_motoboy);
  }

  @Patch('add/:id')
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Adicionar item ao carrinho', description: 'Adiciona um item ao carrinho do usuário autenticado com base no ID do produto.' })
  @ApiResponse({ status: 200, description: 'Item adicionado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  add(@Param('id') id_produto: string, @Req() req: Request, @Body() input: AddCarrinhoDto) {
    const id_motoboy = req['user'].sub;
    return this.addCarrinhoUseCase.addCarrinho(id_produto, id_motoboy, input);
  }

  @Patch('finish/:id')
  @ApiOperation({ summary: 'Finalizar compra do carrinho', description: 'Finaliza a compra do carrinho com base no ID fornecido.' })
  @ApiResponse({ status: 200, description: 'Compra finalizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Erro na finalização da compra.' })
  finish(@Param('id') id: string) {
    return this.finishCompraCarrinhoUseCase.finishCompra(id);
  }
}
