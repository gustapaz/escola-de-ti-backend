import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ObjectiveController } from './objective.controller';
import { ObjectiveRepository } from '../domain/repository/objective.repository';
import { DeleteObjectiveUseCase } from '../domain/service/delete-objective.use-cases';
import { CreateObjectiveUseCase } from '../domain/service/create-objective.use-cases';
import { FindObjectiveUseCase } from '../domain/service/find-objective.use-cases';
import { UpdateObjectiveUseCase } from '../domain/service/update-objective.use-case';
import { ConfigModule } from '@nestjs/config';
import { ObjectiveRepositoryImpl } from '../data-access/infraestructure/repository/objective.repository.impl';
import { ObjectiveModule } from './objective.module';
import { KnexModule } from 'nestjs-knex';
import { CloudinaryModule } from '../../cloudinary/resource/cloudinary.module';
import { ImagensModule } from '../../imagens/resource/imagens.module';
import {
  IMAGEN_CREATE_PROVIDER,
  IMAGEN_DELETE_PROVIDER,
  IMAGEN_FIND_BY_ID_PROVIDER,
  IMAGEN_UPDATE_PROVIDER,
} from '../../shared/constants/injection-tokens';
import { CreateImagenUseCase } from '../../imagens/domain/service/create-imagem.use-case';
import { FindByIdImagemUseCase } from '../../imagens/domain/service/find-by-id-imagem.use-case';
import { DeleteImagensUseCase } from '../../imagens/domain/service/delete-imagem.use-case';
import { UpdateImagemUseCase } from '../../imagens/domain/service/update-imagem.use-case';
import { ICloudinaryProvider } from '../../cloudinary/domain/interfaces/icloudinary.provider';
import { CloudinaryProvider } from '../../cloudinary/data-access/infraestructure/storage/cloudinary.provider';
import { ImagemRepository } from '../../imagens/domain/repository/imagem.repository';
import { ImagemRepositoryImpl } from '../../imagens/data-access/infraestructure/repository/imagem.repository.impl';

describe('ObjectiveController (e2e)', () => {
  let app: INestApplication;
  let objectiveId: string;

  const objectiveData = {
    descricao: 'Entregar 3 cheeseburgers',
    id_campanha: 'f2e5dbd8-dc65-4724-aa18-9fffd7944a02',
    titulo: 'Entregar sushi',
    premio_associado: 80,
    meta: 0.3,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ObjectiveModule,
        CloudinaryModule,
        ImagensModule,
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
      controllers: [ObjectiveController],
      providers: [
        CreateObjectiveUseCase,
        FindObjectiveUseCase,
        UpdateObjectiveUseCase,
        DeleteObjectiveUseCase,
        {
          provide: ObjectiveRepository,
          useClass: ObjectiveRepositoryImpl,
        },
        {
          provide: IMAGEN_CREATE_PROVIDER,
          useClass: CreateImagenUseCase,
        },
        {
          provide: IMAGEN_FIND_BY_ID_PROVIDER,
          useClass: FindByIdImagemUseCase,
        },
        {
          provide: IMAGEN_DELETE_PROVIDER,
          useClass: DeleteImagensUseCase,
        },
        {
          provide: IMAGEN_UPDATE_PROVIDER,
          useClass: UpdateImagemUseCase,
        },
        {
          provide: ICloudinaryProvider,
          useClass: CloudinaryProvider,
        },
        {
          provide: ImagemRepository,
          useClass: ImagemRepositoryImpl,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST /objective should create a objective', async () => {
    const response = await request(app.getHttpServer())
      .post('/objective')
      .field('descricao', objectiveData.descricao)
      .field('id_campanha', objectiveData.id_campanha)
      .field('titulo', objectiveData.titulo)
      .field('premio_associado', objectiveData.premio_associado)
      .field('meta', objectiveData.meta)
      .attach('image', 'test/assets/objectives/achievement-badge-01.png')
      .expect(201);

    objectiveId = response.body.id;
  }, 10000);

  it('/GET /objective should list all objectives', async () => {
    const response = await request(app.getHttpServer())
      .get('/objective')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    const objectiveFirst = response.body[0];
    expect(objectiveFirst).toHaveProperty('id');
    expect(objectiveFirst).toHaveProperty('descricao');
    expect(objectiveFirst).toHaveProperty('id_campanha');
    expect(objectiveFirst).toHaveProperty('titulo');
    expect(objectiveFirst).toHaveProperty('premio_associado');
    expect(objectiveFirst).toHaveProperty('meta');

    const objectiveLast = response.body[response.body.length - 1];
    expect(objectiveLast).toHaveProperty('id');
    expect(objectiveLast).toHaveProperty('descricao');
    expect(objectiveLast).toHaveProperty('id_campanha');
    expect(objectiveLast).toHaveProperty('titulo');
    expect(objectiveLast).toHaveProperty('premio_associado');
    expect(objectiveLast).toHaveProperty('meta');
  }, 10000);

  it('GET /objective/:id should return a objective', async () => {
    const response = await request(app.getHttpServer())
      .get(`/objective/${objectiveId}`)
      .expect(200);

    expect(response.body).toMatchObject({ ...objectiveData });
    expect(typeof response.body.id).toBe('string');
  }, 10000);

  it('PUT /objective/:id should update a objective', async () => {
    await request(app.getHttpServer())
      .put(`/objective/${objectiveId}`)
      .field('descricao', objectiveData.descricao)
      .field('id_campanha', objectiveData.id_campanha)
      .field('titulo', 'Objetivo Abril')
      .field('premio_associado', objectiveData.premio_associado)
      .field('meta', objectiveData.meta)
      .attach('image', 'test/assets/moscando.jpg')
      .expect(200);
  }, 10000);

  it('DELETE /objective/:id should delete a objective', async () => {
    const postResponse = await request(app.getHttpServer())
      .post('/objective')
      .field('descricao', objectiveData.descricao)
      .field('id_campanha', objectiveData.id_campanha)
      .field('titulo', objectiveData.titulo)
      .field('premio_associado', objectiveData.premio_associado)
      .field('meta', objectiveData.meta)
      .attach('image', 'test/assets/moscando.jpg')
      .expect(201);

    const objectiveId = postResponse.body.id;

    await request(app.getHttpServer())
      .delete(`/objective/${objectiveId}`)
      .expect(200);
  }, 10000);
});
