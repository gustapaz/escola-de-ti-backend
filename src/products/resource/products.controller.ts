import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody, ApiConsumes, ApiProperty } from '@nestjs/swagger';

import { CreateProductDto } from '../domain/dto/create-product.dto';
import { UpdateProductDto } from '../domain/dto/update-product.dto';
import { CreateProductsUseCase } from '../domain/service/create-products.use-case';
import { FindAllProductsUseCase } from '../domain/service/find-all-products.use-case';
import { FindByIdProductsUseCase } from '../domain/service/find-by-id-products.use-case';
import { UpdateProductsUseCase } from '../domain/service/update-products.use-case';
import { DeleteProductsUseCase } from '../domain/service/delete-products.use-case';

@Controller('products')
@ApiTags('produtos')
export class ProductsController {
  constructor(
    private readonly createProductsUseCase: CreateProductsUseCase,
    private readonly findAllProductsUseCase: FindAllProductsUseCase,
    private readonly findByIdProductsUseCase: FindByIdProductsUseCase,
    private readonly updateProductsUseCase: UpdateProductsUseCase,
    private readonly deleteProductsUseCase: DeleteProductsUseCase,
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Criar um novo produto', description: 'Este endpoint permite a criação de um novo produto com uma imagem opcional.' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Requisição inválida.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dados do produto e imagem opcional',
    required: true,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Nome do produto' },
        description: { type: 'string', description: 'Descrição do produto' },
        image: { type: 'string', format: 'binary', description: 'Imagem do produto' },
      },
    },
  })
  create(
    @Body() input: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.createProductsUseCase.create(input, image);
  }

  @Get()
  @ApiOperation({ summary: 'Obter todos os produtos', description: 'Recupera uma lista de todos os produtos disponíveis.' })
  @ApiResponse({ status: 200, description: 'Lista de produtos obtida com sucesso.' })
  findAll() {
    return this.findAllProductsUseCase.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um único produto', description: 'Recupera os detalhes de um produto específico pelo seu ID.' })
  @ApiParam({ name: 'id', type: String, description: 'ID do produto a ser recuperado' })
  @ApiResponse({ status: 200, description: 'Detalhes do produto obtidos com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.findByIdProductsUseCase.findById(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Atualizar um produto', description: 'Atualiza os detalhes de um produto existente, incluindo sua imagem.' })
  @ApiParam({ name: 'id', type: String, description: 'ID do produto a ser atualizado' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Requisição inválida.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  update(
    @Param('id') id: string,
    @Body() input: UpdateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.updateProductsUseCase.update(id, input, image);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um produto', description: 'Remove um produto existente pelo seu ID.' })
  @ApiParam({ name: 'id', type: String, description: 'ID do produto a ser removido' })
  @ApiResponse({ status: 200, description: 'Produto removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  remove(@Param('id') id: string) {
    return this.deleteProductsUseCase.delete(id);
  }
}
