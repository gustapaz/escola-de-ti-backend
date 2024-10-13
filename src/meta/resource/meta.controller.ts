import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { CreateMetaDto } from '../domain/dto/create-meta.dto';
import { UpdateMetaDto } from '../domain/dto/update-meta.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { CreateMetaUseCase } from '../domain/service/create-meta.use-cases';
import { UpdateMetaUseCase } from '../domain/service/update-meta.use-case';
import { DeleteMetaUseCase } from '../domain/service/delete-meta.use-cases';
import { FindMetaUseCase } from '../domain/service/find-meta.use-cases';

@ApiTags('meta')
@ApiBearerAuth()
@Controller('meta')
export class MetaController {
  constructor(
    private readonly createMetaUseCase: CreateMetaUseCase,
    private readonly updateMetaUseCase: UpdateMetaUseCase,
    private readonly deleteMetaUseCase: DeleteMetaUseCase,
    private readonly findMetaUseCase: FindMetaUseCase,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova Meta', description: 'Cria uma nova Meta com base nos dados fornecidos.' })
  @ApiBody({ type: CreateMetaDto, description: 'Dados da Meta a ser criada' })
  @ApiResponse({ status: 201, description: 'Meta criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Entrada inválida.' })
  async create(@Body() input: CreateMetaDto) {
    return this.createMetaUseCase.create(input);
  }

  @Put()
  @ApiOperation({ summary: 'Atualizar uma Meta existente', description: 'Atualiza uma Meta existente com base no ID fornecido e nos dados atualizados.' })
  @ApiParam({
    name: 'id_objetivo',
    description: 'ID do Objetivo da Meta a ser atualizada',
  })
  @ApiParam({
    name: 'id_inscrito',
    description: 'ID do Inscrito da Meta a ser atualizada',
  })
  @ApiBody({ type: UpdateMetaDto, description: 'Dados atualizados da Meta' })
  @ApiResponse({ status: 200, description: 'Meta atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Meta não encontrada.' })
  @ApiResponse({ status: 400, description: 'Entrada inválida.' })
  async update(
    @Query('id_objetivo') idObjetivo: string,
    @Query('id_inscrito') idInscrito: string,
    @Body() input: UpdateMetaDto,
  ) {
    return await this.updateMetaUseCase.update(idObjetivo, idInscrito, input);
  }

  @Delete()
  @ApiOperation({ summary: 'Excluir uma Meta', description: 'Exclui uma Meta com base no ID fornecido.' })
  @ApiParam({
    name: 'id_objetivo',
    description: 'ID do Objetivo da Meta a ser excluída',
  })
  @ApiParam({
    name: 'id_inscrito',
    description: 'ID do Inscrito da Meta a ser excluída',
  })
  @ApiResponse({ status: 200, description: 'Meta excluída com sucesso.' })
  @ApiResponse({ status: 404, description: 'Meta não encontrada.' })
  async delete(
    @Query('id_objetivo') idObjetivo: string,
    @Query('id_inscrito') idInscrito: string,
  ) {
    return this.deleteMetaUseCase.delete(idObjetivo, idInscrito);
  }

  @Get('/all')
  @ApiOperation({ summary: 'Listar todas as Metas', description: 'Lista todas as Metas cadastradas.' })
  @ApiResponse({
    status: 200,
    description: 'Lista de Metas',
    type: [CreateMetaDto],
  })
  async findAll() {
    return this.findMetaUseCase.findAll();
  }

  @Get()
  @ApiOperation({ summary: 'Buscar uma Meta específica', description: 'Recupera detalhes de uma Meta com base no ID fornecido.' })
  @ApiParam({
    name: 'id_objetivo',
    description: 'ID do Objetivo da Meta a ser recuperada',
  })
  @ApiParam({
    name: 'id_inscrito',
    description: 'ID do Inscrito da Meta a ser recuperada',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da Meta',
    type: CreateMetaDto,
  })
  @ApiResponse({ status: 404, description: 'Meta não encontrada.' })
  async findOne(
    @Query('id_objetivo') idObjetivo: string,
    @Query('id_inscrito') idInscrito: string,
  ) {
    return this.findMetaUseCase.findOne(idObjetivo, idInscrito);
  }
}
