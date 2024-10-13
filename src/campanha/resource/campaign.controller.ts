import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { CreateCampaignDto } from '../domain/dto/create-campaign.dto';
import { UpdateCampaignDto } from '../domain/dto/update-campaign.dto';
import { CreateCampaignUseCase } from '../domain/service/create-campaign.use-cases';
import { UpdateCampaignUseCase } from '../domain/service/update-campaign.use-case';
import { DeleteCampaignUseCase } from '../domain/service/delete-campaign.use-cases';
import { FindCampaignUseCase } from '../domain/service/find-campaign.use-cases';
import { ErrorResponseDto } from '../../auth/domain/dto/error-response.dto';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('campaign')
@ApiBearerAuth()
@Controller('campaign')
export class CampaignController {
  constructor(
    private readonly createCampaignUseCase: CreateCampaignUseCase,
    private readonly updateCampaignUseCase: UpdateCampaignUseCase,
    private readonly deleteCampaignUseCase: DeleteCampaignUseCase,
    private readonly findCampaignUseCase: FindCampaignUseCase,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Criar campanha', description: 'Cria uma nova campanha com base nos dados fornecidos.' })
  @ApiBody({
    type: CreateCampaignDto,
    description: 'Dados para criação da campanha',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {
            dias: ['Segunda-Feira', 'Terça-Feira'],
          },
          code: 1001,
          message: 'dias must be an array',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {
            horario_inicial: '2023-12-01T08:00:00Z',
          },
          code: 1001,
          message: 'horario_inicial must be a valid ISO 8601 date string',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {
            horario_final: '2023-12-10T16:00:00Z',
          },
          code: 1001,
          message: 'horario_final must be a valid ISO 8601 date string',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {
            limite_corridas_ignoradas: 5,
          },
          code: 1001,
          message: 'limite_corridas_ignoradas must be an integer number',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {
            limite_corridas_recusadas: 5,
          },
          code: 1001,
          message: 'limite_corridas_recusadas must be an integer number',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {
            tempo_de_tolerancia: '2023-12-01T08:10:00Z',
          },
          code: 1001,
          message: 'tempo_de_tolerancia must be a valid ISO 8601 date string',
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
            tipo: 'This is a very long campaign name that should definitely fail validation',
          },
          code: 1011,
          message: 'Erro ao criar Campanha',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() input: CreateCampaignDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.createCampaignUseCase.create(input, image);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar campanha', description: 'Atualiza uma campanha existente com base no ID fornecido e nos dados atualizados.' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {
            tipo: 'Campanha Massas Março',
            dias: ['Segunda-Feira', 'Terça-Feira'],
            horario_inicial: '2023-12-01T08:00:00Z',
            horario_final: '2023-12-10T16:00:00Z',
            limite_corridas_ignoradas: 5,
            limite_corridas_recusadas: 5,
            tempo_de_tolerancia: '2023-12-01T08:10:00Z',
            descricao:
              'Participe da campanha de massas de Março e obtenha bônus por entrega!',
          },
          code: 1011,
          message: 'Erro ao atualizar Campanha',
        },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'ID da campanha' })
  @ApiBody({
    type: UpdateCampaignDto,
    description: 'Dados para atualização da campanha',
  })
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() input: UpdateCampaignDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.updateCampaignUseCase.update(id, input, image);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar campanha', description: 'Exclui uma campanha com base no ID fornecido.' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {},
          code: 1011,
          message: 'Erro ao excluir Campanha',
        },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'ID da campanha' })
  async delete(@Param('id') id: string) {
    return await this.deleteCampaignUseCase.delete(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as campanhas', description: 'Lista todas as campanhas cadastradas.' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {},
          code: 1011,
          message: 'Erro ao listar Campanhas',
        },
      },
    },
  })
  async findAll() {
    return await this.findCampaignUseCase.findAll();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar campanha por ID', description: 'Recupera detalhes de uma campanha com base no ID fornecido.' })
  @ApiNotFoundResponse({
    description: 'Campanha não encontrada',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {},
          code: 1003,
          message: 'Campanha não encontrada',
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
          message: 'Erro ao buscar Campanha por ID',
        },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'ID da campanha' })
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const motoboyId = req['user'].sub;
    return await this.findCampaignUseCase.findOne(id, motoboyId);
  }
}
