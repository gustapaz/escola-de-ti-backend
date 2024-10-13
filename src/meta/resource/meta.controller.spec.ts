import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MetaController } from './meta.controller';
import { CreateMetaUseCase } from '../domain/service/create-meta.use-cases';
import { FindMetaUseCase } from '../domain/service/find-meta.use-cases';
import { UpdateMetaUseCase } from '../domain/service/update-meta.use-case';
import { DeleteMetaUseCase } from '../domain/service/delete-meta.use-cases';
import { MetaRepository } from '../domain/repository/meta.repository';
import { ConfigModule } from '@nestjs/config';
import { MetaRepositoryImpl } from '../data-access/infraestructure/repository/meta.repository.impl';
import { MetaModule } from './meta.module';
import { KnexModule } from 'nestjs-knex';
import { ObjectiveRepository } from '../../objetivo/domain/repository/objective.repository';
import { ObjectiveRepositoryImpl } from '../../objetivo/data-access/infraestructure/repository/objective.repository.impl';

describe('MetaController (e2e)', () => {
  let app: INestApplication;

  const MetaData = {
    id_inscrito: '79817b83-78f3-4184-8322-dea8abfc33a6',
    id_campanha: 'f2e5dbd8-dc65-4724-aa18-9fffd7944a02',
    id_objetivo: 'e6cfc67e-4115-4f11-ac4e-6e2bf6eab70f',
    valor_atingido: 50,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MetaModule,
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
      controllers: [MetaController],
      providers: [
        CreateMetaUseCase,
        FindMetaUseCase,
        UpdateMetaUseCase,
        DeleteMetaUseCase,
        {
          provide: MetaRepository,
          useClass: MetaRepositoryImpl,
        },
        {
          provide: ObjectiveRepository,
          useClass: ObjectiveRepositoryImpl,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST /meta should create a new meta', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/meta')
      .send(MetaData)
      .expect(201);

    expect(body).toMatchObject({ ...MetaData });
    expect(body.id_objetivo).toBe(MetaData.id_objetivo);
    expect(body.id_inscrito).toBe(MetaData.id_inscrito);
  }, 10000);

  it('/GET /meta should list all metas', async () => {
    const response = await request(app.getHttpServer())
      .get('/meta/all')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    const metaFirst = response.body[0];
    expect(metaFirst).toHaveProperty('id_inscrito');
    expect(metaFirst).toHaveProperty('id_campanha');
    expect(metaFirst).toHaveProperty('id_objetivo');
    expect(metaFirst).toHaveProperty('valor_atingido');

    const metaLast = response.body[response.body.length - 1];
    expect(metaLast).toHaveProperty('id_inscrito');
    expect(metaLast).toHaveProperty('id_campanha');
    expect(metaLast).toHaveProperty('id_objetivo');
    expect(metaLast).toHaveProperty('valor_atingido');
  }, 10000);

  it('GET /meta should return a specific meta', async () => {
    const response = await request(app.getHttpServer())
      .get(
        `/meta?id_objetivo=${MetaData.id_objetivo}&id_inscrito=${MetaData.id_inscrito}`,
      )
      .expect(200);

    const specificMeta = Array.isArray(response.body)
      ? response.body[0]
      : response.body;
    expect(specificMeta).toMatchObject({ ...MetaData });
    expect(specificMeta).toHaveProperty('id_objetivo', MetaData.id_objetivo);
    expect(specificMeta).toHaveProperty('id_inscrito', MetaData.id_inscrito);
  }, 10000);

  it('PUT /meta should update a meta', async () => {
    const objetivoResponse = await request(app.getHttpServer())
      .get(`/objective/${MetaData.id_objetivo}`)
      .expect(200);
    const valorTotalObjetivo = objetivoResponse.body.meta;

    const valorAtingido = 75;

    const updatedMetaData = {
      valor_atingido: valorAtingido,
    };

    const putResponse = await request(app.getHttpServer())
      .put(
        `/meta?id_objetivo=${MetaData.id_objetivo}&id_inscrito=${MetaData.id_inscrito}`,
      )
      .send(updatedMetaData)
      .expect(200);

    const expectedPercentage = valorAtingido / valorTotalObjetivo;

    expect(putResponse.body).toMatchObject({
      id_objetivo: MetaData.id_objetivo,
      id_inscrito: MetaData.id_inscrito,
      valor_atingido: expectedPercentage,
    });
  }, 10000);

  it('DELETE /meta should delete a meta', async () => {
    await request(app.getHttpServer())
      .delete(
        `/meta?id_objetivo=${MetaData.id_objetivo}&id_inscrito=${MetaData.id_inscrito}`,
      )
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  }, 10000);
});
