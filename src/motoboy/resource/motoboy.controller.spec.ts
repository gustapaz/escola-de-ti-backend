import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, forwardRef } from '@nestjs/common';
import request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { MotoboyModule } from './motoboy.module';
import { MotoboyController } from './motoboy.controller';
import { CreateMotoboyUseCase } from '../domain/service/create-motoboy.use-case';
import { FindAllMotoboyUseCase } from '../domain/service/find-all-motoboy.use-case';
import { FindByIdMotoboyUseCase } from '../domain/service/find-by-id-motoboy.use-case';
import { FindByEmailMotoboyUseCase } from '../domain/service/find-by-email-motoboy.use-case';
import { UpdateMotoboyUseCase } from '../domain/service/update-motoboy.use-case';
import { UpdateMotoboyAiqcoinsUseCase } from '../domain/service/update-motoboy-aiqcoins.use-case';
import { DeleteMotoboyUseCase } from '../domain/service/delete-motoboy.use-case';
import { MotoboyRepository } from '../domain/repository/motoboy.repository';
import { MotoboyRepositoryImpl } from '../data-access/infraestructure/repostitory/motoboy.repository.impl';
import {
  MOTOBOY_UPDATE_PROVIDER,
  MOTOBOY_FIND_BY_ID_PROVIDER,
} from '../../shared/constants/injection-tokens';
import { GenerateBearer } from '../../shared/utils/generate-bearer';
import { LoginUseCase } from '../../auth/domain/service/login.use-case';
import { AuthModule } from '../../auth/resource/auth.module';
import { hashPassword } from '../../auth/utils/hash-password';

enum UserInfoFields {
  cnpj = '00000000000100',
  cpf = '00000000000',
  nome = 'User0003',
  sobrenome = 'Sobrenome0003',
  email = 'userSobre002@gmail.com',
  telefone = '00000000001',
  token_dispositivo = 'token_dispositivo',
  data_de_nascimento = '05/09/2023',
  senha = 'senha123',
  mochila = 'true',
  cidade = 'Maringa',
}

describe('MotoboyController (e2e)', () => {
  let app: INestApplication;
  let mockemail: string;
  let mocksenha: string;
  let mockid: string;
  let jwtToken: any;
  let motoboyRepo: MotoboyRepository;
  let generateBearer: GenerateBearer;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MotoboyModule,
        forwardRef(() => AuthModule),
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        KnexModule.forRoot({
          config: {
            client: 'postgresql',
            useNullAsDefault: true,
            connection: {
              connectionString: process.env.TEST_DATABASE_URL,
              ssl: { rejectUnauthorized: false },
              host: process.env.TEST_HOST,
              port: 5432,
              user: process.env.TEST_USER,
              database: process.env.TEST_DATABASE,
              password: process.env.TEST_PASSWORD,
            },
          },
        }),
      ],
      controllers: [MotoboyController],
      providers: [
        CreateMotoboyUseCase,
        FindAllMotoboyUseCase,
        FindByIdMotoboyUseCase,
        FindByEmailMotoboyUseCase,
        UpdateMotoboyUseCase,
        UpdateMotoboyAiqcoinsUseCase,
        DeleteMotoboyUseCase,
        {
          provide: MotoboyRepository,
          useClass: MotoboyRepositoryImpl,
        },
        {
          provide: MOTOBOY_UPDATE_PROVIDER,
          useClass: UpdateMotoboyAiqcoinsUseCase,
        },
        {
          provide: MOTOBOY_FIND_BY_ID_PROVIDER,
          useClass: FindByIdMotoboyUseCase,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    motoboyRepo = moduleFixture.get<MotoboyRepository>(MotoboyRepository);
    const loginUseCase = moduleFixture.get<LoginUseCase>(LoginUseCase);
    generateBearer = new GenerateBearer(loginUseCase);
  });

  afterAll(async () => {
    if (mockid) {
      await motoboyRepo.delete(mockid);
    }
    await app.close();
  });

  it('/motoboy (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/motoboy')
      .send({
        cnpj: UserInfoFields.cnpj,
        cpf: UserInfoFields.cpf,
        nome: UserInfoFields.nome,
        sobrenome: UserInfoFields.sobrenome,
        email: UserInfoFields.email,
        data_de_nascimento: UserInfoFields.data_de_nascimento,
        telefone: UserInfoFields.telefone,
        senha: hashPassword(UserInfoFields.senha),
        token_dispositivo: UserInfoFields.token_dispositivo,
        mochila: true,
        cidade: UserInfoFields.cidade,
      });
    mockemail = UserInfoFields.email;
    mocksenha = UserInfoFields.senha;
    mockid = response.body.id;
    jwtToken = await generateBearer.getJwtToken(mockemail, mocksenha, mockid);
    expect(response.status).toBe(201);
  }, 10000);

  it('/motoboy (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/motoboy')
      .set('Authorization', `Bearer ${jwtToken.access_token}`);
    expect(response.status).toBe(200);
  }, 10000);

  it('/motoboy/findOne (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/motoboy/findOne`)
      .set('Authorization', `Bearer ${jwtToken.access_token}`);
    expect(response.status).toBe(200);
  }, 10000);

  it('/motoboy/update (PATCH)', async () => {
    const response = await request(app.getHttpServer())
    .patch(`/motoboy/update`)
    .set('Authorization', `Bearer ${jwtToken.access_token}`)
    .send({
      nome: UserInfoFields.nome,
      sobrenome: UserInfoFields.sobrenome,
      email: UserInfoFields.email,
      telefone: UserInfoFields.telefone,
      data_de_nascimento: UserInfoFields.data_de_nascimento,
      cidade: UserInfoFields.cidade
    })
    expect(response.status).toBe(200)
  }, 10000)
});
