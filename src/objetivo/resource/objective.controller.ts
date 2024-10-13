import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { CreateObjectiveDto } from '../domain/dto/create-objective.dto';
import { UpdateObjectiveDto } from '../domain/dto/update-objective.dto';
import { CreateObjectiveUseCase } from '../domain/service/create-objective.use-cases';
import { UpdateObjectiveUseCase } from '../domain/service/update-objective.use-case';
import { DeleteObjectiveUseCase } from '../domain/service/delete-objective.use-cases';
import { FindObjectiveUseCase } from '../domain/service/find-objective.use-cases';
import { ErrorResponseDto } from '../../auth/domain/dto/error-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Objective')
@ApiBearerAuth()
@Controller('objective')
export class ObjectiveController {
  constructor(
    private readonly createObjectiveUseCase: CreateObjectiveUseCase,
    private readonly updateObjectiveUseCase: UpdateObjectiveUseCase,
    private readonly deleteObjectiveUseCase: DeleteObjectiveUseCase,
    private readonly findObjectiveUseCase: FindObjectiveUseCase,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Criar um novo Objetivo', description: 'Cria um novo Objetivo com base nos dados fornecidos.' })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {
            dias: [],
          },
          code: 1001,
          message: '',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {
            id_campanha: '00000000-0000-0000-0000-000000000000',
            titulo: 'Objetivo Março',
            descricao: 'Objetivo para o mês de Março',
            premio_associado: 100,
            meta: 500.5,
          },
          code: 1011,
          message: 'Erro ao criar Objetivo',
        },
      },
    },
  })
  @ApiBody({
    type: CreateObjectiveDto,
    description: 'Dados do Objetivo a ser criado',
  })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() input: CreateObjectiveDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.createObjectiveUseCase.create(input, image);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um Objetivo existente', description: 'Atualiza um Objetivo existente com base no ID fornecido e nos dados atualizados.' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {
            id_campanha: '00000000-0000-0000-0000-000000000000',
            titulo: 'Objetivo Março',
            descricao: 'Objetivo para o mês de Março',
            premio_associado: 100,
            meta: 500.5,
          },
          code: 1011,
          message: 'Erro ao atualizar Objetivo',
        },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'ID do Objetivo para atualizar' })
  @ApiBody({
    type: UpdateObjectiveDto,
    description: 'Dados atualizados do Objetivo',
  })
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() input: UpdateObjectiveDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.updateObjectiveUseCase.update(id, input, image);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir um Objetivo', description: 'Exclui um Objetivo com base no ID fornecido.' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {},
          code: 1011,
          message: 'Erro ao excluir Objetivo',
        },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'ID do Objetivo para excluir' })
  async delete(@Param('id') id: string) {
    return this.deleteObjectiveUseCase.delete(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os Objetivos', description: 'Lista todos os Objetivos cadastrados.' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {},
          code: 1011,
          message: 'Erro ao listar Objetivos',
        },
      },
    },
  })
  async findAll() {
    return this.findObjectiveUseCase.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um Objetivo específico', description: 'Recupera detalhes de um Objetivo com base no ID fornecido.' })
  @ApiNotFoundResponse({
    description: 'Objetivo não encontrado',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {},
          code: 1003,
          message: 'Objetivo não encontrado',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {},
          code: 1011,
          message: 'Erro ao buscar Objetivo pro ID',
        },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'ID do Objetivo a ser recuperado' })
  async findOne(@Param('id') id: string) {
    return this.findObjectiveUseCase.findOne(id);
  }
}
