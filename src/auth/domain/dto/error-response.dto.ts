import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
    @ApiProperty({
        default: true,
        type: Boolean,
        description: 'Error',
    })
    error: boolean;

    @ApiProperty({
        type: Object,
        example: {
            email: 'joao.almeida@example.com',
            senha: 'senhaSegura123',
        },
        description: 'List',
    })
    list: Record<string, string>;

    @ApiProperty({
        default: 1001,
        type: Number,
        description: 'Error code',
    })
    code: number;

    @ApiProperty({
        type: String,
        description: 'Error message',
    })
    message: string;
}
