import { HttpException } from '@nestjs/common';

const errorCodes = {                          //1000: 'Erro Padrao',
    'BadRequestException': 1001,              // Solicitação inválida
    'UnauthorizedException': 1002,            // Falta de autenticação
    'NotFoundException': 1003,                // Recurso não encontrado
    'ForbiddenException': 1004,               // Falta de permissão
    'NotAcceptableException': 1005,           // Não aceitável (usado geralmente quando o servidor não pode produzir uma resposta correspondendo a uma das linguagens ou formatos definidos no cabeçalho da solicitação)
    'RequestTimeoutException': 1006,          // Tempo limite da solicitação excedido
    'ConflictException': 1007,                // Conflito (por exemplo, ao criar um recurso que já existe)
    'GoneException': 1008,                    // O recurso alvo não está mais disponível no servidor e não haverá redirecionamento
    'PayloadTooLargeException': 1009,         // Carga útil da solicitação é muito grande
    'UnsupportedMediaTypeException': 1010,    // Tipo de mídia da solicitação não é suportado
    'InternalServerErrorException': 1011,     // Erro de servidor interno
    'NotImplementedException': 1012,          // Método da API não implementado
    'BadGatewayException': 1013,              // Erro ao tentar usar um gateway intermediário para se comunicar com outro serviço
    'ServiceUnavailableException': 1014,      // Serviço não disponível
    'GatewayTimeoutException': 1015,          // Tempo limite do gateway excedido
  };

export function getErrorCodeForException(exception: HttpException): number {
    const exceptionName = exception.constructor.name;
    return errorCodes[exceptionName] || 1000; 
  }
  
  
  