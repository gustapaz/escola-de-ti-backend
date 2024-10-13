import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { RegisterDto } from '../domain/dto/register.dto';
import {
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { LoginDto } from '../domain/dto/login.dto';
import { ProfileDto } from '../domain/dto/profile.dto';
import { SmsDto } from '../domain/dto/sms.dto';
import { RegisterUseCase } from '../domain/service/register.use-case';
import { LoginUseCase } from '../domain/service/login.use-case';
import { ProfileUseCase } from '../domain/service/profile.use-case';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { SmsUseCase } from '../domain/service/sms.use-case';
import { RefreshTokenUseCase } from '../domain/service/refresh-token.use-case';
import { ErrorResponseDto } from '../domain/dto/error-response.dto';
@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly profileUseCase: ProfileUseCase,
    private readonly smsUseCase: SmsUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) { }

  @Post('sendNumber')
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {
            telefone: '(00) 00000-0000',
          },
          code: 1001,
          message: 'telefone must be longer than or equal to 15 characters',
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
            telefone: '(00) 00000-0000',
          },
          code: 1011,
          message: 'Erro ao gerar código de verificação.',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Gera código de verificação para um número de telefone', description: 'Este endpoint gera um código de verificação para um número de telefone fornecido.' })
  generateCode(@Body() body: SmsDto) {
    return this.smsUseCase.generateCode(body.telefone);
  }

  @Post('validateCode')
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {
            telefone: '(00) 00000-0000',
            codigo: 1234,
          },
          code: 1011,
          message: 'Erro ao validar código de verificação.',
        },
      },
    },
  })
  @ApiBody({
    description: 'Body for validate code',
    type: 'object',
    required: true,
    examples: {
      'validate-code': {
        summary: 'Example body for validate code',
        value: {
          telefone: '(00) 00000-0000',
          codigo: 1234,
        },
      },
    },
  })
  @ApiOperation({ summary: 'Valida o código de verificação enviado para o telefone', description: 'Este endpoint valida o código de verificação enviado para um número de telefone fornecido.' })
  validateCode(@Body() body: { telefone: string; codigo: number }) {
    return this.smsUseCase.validateCode(body.telefone, body.codigo);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {
            email: 'Isso não é um email',
            senha: 'senhaSegura123',
          },
          code: 1001,
          message: 'email must be an email',
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
            email: 'joao.almeida@example.com',
            senha: 'senha',
          },
          code: 1001,
          message: 'senha must be longer than or equal to 8 characters',
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
            email: 'joao.almeida@example.com',
            senha: 'senhaSegura123',
          },
          code: 1011,
          message: 'Erro ao realizar login.',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Not found',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {
            email: 'joao.almeida@example.com',
            senha: 'senhaSegura123',
          },
          code: 1002,
          message: 'E-mail não encontrado.',
        },
      },
    },
  })
  @ApiBody({
    description: 'Login payload',
    type: LoginDto,
    required: true,
    examples: {
      'login-example': {
        summary: 'Example login payload',
        value: {
          email: 'joao.almeida@example.com',
          senha: 'senhaSegura123',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Autentica o usuário com e-mail e senha', description: 'Este endpoint autentica um usuário com base em seu e-mail e senha fornecidos.' })
  login(@Body() loginDto: LoginDto) {
    return this.loginUseCase.login(loginDto);
  }

  @Post('register')
  @ApiConflictResponse({
    description: 'Conflict',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {
            nome: 'João',
            sobrenome: 'Almeida',
            email: 'joao.almeida@example.com',
            data_de_nascimento: '01/01/1990',
            mochila: true,
            cpf: '123.456.789-00',
            cnpj: '12.345.678/0001-99',
            telefone: 'teste',
            senha: 'senhaSegura123',
            cidade: 'Massaranduba',
          },
          code: 1003,
          message: 'E-mail já cadastrado.',
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
            nome: 'João',
            sobrenome: 'Almeida',
            email: 'joao.almeida@example.com',
            data_de_nascimento: '01/01/1990',
            mochila: true,
            cpf: '123.456.789-00',
            cnpj: '12.345.678/0001-99',
            telefone: 'teste',
            senha: 'senhaSegura123',
            cidade: 'Massaranduba',
          },
          code: 1011,
          message: 'Erro interno ao tentar registrar.',
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
            nome: 'João',
            sobrenome: 'Almeida',
            email: 'joao.almeida@example.com',
            data_de_nascimento: '01/01/1990',
            mochila: true,
            cpf: '123.456.789-00',
            cnpj: '12.345.678/0001-99',
            telefone: 'teste',
            senha: 'senhaSegura123',
            cidade: 'Massaranduba',
          },
          code: 1001,
          message: 'senha must be longer than or equal to 8 characters',
        },
      },
    },
  })
  @ApiBody({
    description: 'Register payload',
    type: RegisterDto,
    required: true,
  })
  @ApiOperation({ summary: 'Registra um novo usuário no sistema', description: 'Este endpoint registra um novo usuário no sistema com base nos dados fornecidos.' })
  create(@Body() createCadastroDto: RegisterDto): Promise<RegisterDto> {
    return this.registerUseCase.register(createCadastroDto);
  }

  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {},
          code: 1011,
          message: 'Erro ao recuperar perfil.',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {},
          code: 1004,
          message: 'Unauthorized',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile do entregador',
    type: ProfileDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Obtém o perfil do usuário autenticado', description: 'Este endpoint obtém o perfil do usuário autenticado com base no token de acesso fornecido.' })
  getProfile(@Req() req: Request) {
    const email = req.user['email'];
    return this.profileUseCase.profile(email);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiBearerAuth('refresh-token')
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {},
          code: 1011,
          message: 'Erro ao atualizar token.',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          error: true,
          list: {},
          code: 1004,
          message: 'Unauthorized',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Token atualizado',
  })
  @ApiOperation({ summary: 'Atualiza o token de acesso do usuário', description: 'Este endpoint atualiza o token de acesso do usuário com base no token de atualização fornecido.' })
  getRefreshToken(@Req() req: Request) {
    const motoboyId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.refreshTokenUseCase.refreshToken(motoboyId, refreshToken);
  }
}
