import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateMotoboyDto } from '../domain/dto/create-motoboy.dto';
import { UpdateMotoboyRequestDto } from '../domain/dto/update-motoboy-request.dto';
import { CreateMotoboyUseCase } from '../domain/service/create-motoboy.use-case';
import { FindAllMotoboyUseCase } from '../domain/service/find-all-motoboy.use-case';
import { FindByIdMotoboyUseCase } from '../domain/service/find-by-id-motoboy.use-case';
import { UpdateMotoboyUseCase } from '../domain/service/update-motoboy.use-case';
import { DeleteMotoboyUseCase } from '../domain/service/delete-motoboy.use-case';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('motoboy')
export class MotoboyController {
  constructor(
    private readonly createMotoboyUseCase: CreateMotoboyUseCase,
    private readonly findAllMotoboyUseCase: FindAllMotoboyUseCase,
    private readonly findByIdMotoboyUseCase: FindByIdMotoboyUseCase,
    private readonly updateMotoboyUseCase: UpdateMotoboyUseCase,
    private readonly deleteMotoboyUseCase: DeleteMotoboyUseCase,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Criar um novo motoboy', description: 'Este endpoint permite a criação de um novo motoboy.' })
  create(@Body() input: CreateMotoboyDto) {
    return this.createMotoboyUseCase.create(input);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
  @Get()
  @ApiOperation({ summary: 'Listar todos os motoboys cadastrados', description: 'Recupera uma lista de todos os motoboys cadastrados.' })
  findAll() {
    return this.findAllMotoboyUseCase.findAll();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
  @Get('findOne')
  @ApiOperation({ summary: 'Encontrar um motoboy pelo access-token fornecido', description: 'Recupera os detalhes de um motoboy com base no access-token fornecido.' })
  findOne(@Req() req: Request) {
    const id = req['user'].sub;
    return this.findByIdMotoboyUseCase.findById(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
  @Patch('update')
  @ApiOperation({ summary: 'Atualizar os dados de um motoboy', description: 'Atualiza os detalhes de um motoboy com base no access-token fornecido.' })
  update(@Req() req: Request, @Body() input: UpdateMotoboyRequestDto) {
    const id = req['user'].sub;
    return this.updateMotoboyUseCase.update(id, input);
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Remover um motoboy pelo ID fornecido', description: 'Remove um motoboy com base no ID fornecido.' })
  delete(@Param('id') id: string) {
    return this.deleteMotoboyUseCase.delete(id);
  }
}
