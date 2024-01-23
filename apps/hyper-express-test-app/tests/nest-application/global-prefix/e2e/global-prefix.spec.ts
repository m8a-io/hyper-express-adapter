import { RequestMethod } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  AppModule,
  MIDDLEWARE_PARAM_VALUE,
  MIDDLEWARE_VALUE,
} from '../src/app.module';
import { appInit } from '../../../utils/app-init';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';
import { spec } from 'pactum';

describe('Global prefix', () => {
  let app: NestHyperExpressApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication<NestHyperExpressApplication>(
      new HyperExpressAdapter(),
    );
  });

  it(`should use the global prefix`, async () => {
    app.setGlobalPrefix('/api/v1');

    await appInit(app);

    await spec().get('/health').expectStatus(404);

    await spec().get('/api/v1/health').expectStatus(200);
  });

  it(`should exclude the path as string`, async () => {
    app.setGlobalPrefix('/api/v1', { exclude: ['/test', '/middleware'] });

    await appInit(app);
    await spec().get('/test').expectStatus(200);
    await spec().post('/test').expectStatus(201);

    await spec().get('/api/v1/test').expectStatus(404);
    await spec().post('/api/v1/test').expectStatus(404);

    await spec()
      .get('/middleware')
      .expectStatus(200)
      .expectBody(MIDDLEWARE_VALUE);
    await spec()
      .post('/middleware')
      .expectStatus(201)
      .expectBody(MIDDLEWARE_VALUE);

    await spec().get('/api/v1/middleware').expectStatus(404);
    await spec().post('/api/v1/middleware').expectStatus(404);
  });

  it(`should exclude the path as RouteInfo`, async () => {
    app.setGlobalPrefix('/api/v1', {
      exclude: [
        { path: '/health', method: RequestMethod.GET },
        { path: '/middleware', method: RequestMethod.POST },
      ],
    });

    await appInit(app);

    await spec().get('/health').expectStatus(200);

    await spec().get('/middleware').expectStatus(404);
    await spec()
      .post('/middleware')
      .expectStatus(201)
      .expectBody(MIDDLEWARE_VALUE);

    await spec().get('/api/v1/health').expectStatus(404);

    await spec()
      .get('/api/v1/middleware')
      .expectStatus(200)
      .expectBody(MIDDLEWARE_VALUE);
    await spec().post('/api/v1/middleware').expectStatus(404);
  });

  it(`should only exclude the GET RequestMethod`, async () => {
    app.setGlobalPrefix('/api/v1', {
      exclude: [{ path: '/test', method: RequestMethod.GET }],
    });

    await appInit(app);

    await spec().get('/test').expectStatus(200);

    await spec().post('/test').expectStatus(404);

    await spec().post('/api/v1/test').expectStatus(201);
  });

  it(`should exclude the path as a mix of string and RouteInfo`, async () => {
    app.setGlobalPrefix('/api/v1', {
      exclude: ['test', { path: '/health', method: RequestMethod.GET }],
    });

    await appInit(app);

    await spec().get('/health').expectStatus(200);

    await spec().get('/test').expectStatus(200);
  });

  it(`should exclude the path with route param`, async () => {
    app.setGlobalPrefix('/api/v1', {
      exclude: ['/hello/:name', '/middleware/:name'],
    });

    await appInit(app);

    await spec()
      .get('/hello/foo')
      .expectStatus(200)
      .expectBody('Hello: Data attached in middleware');

    await spec()
      .get('/middleware/foo')
      .expectStatus(200)
      .expectBody(MIDDLEWARE_PARAM_VALUE);

    await spec().get('/api/v1/middleware/foo').expectStatus(404);
  });

  it(`should get the params in the global prefix`, async () => {
    app.setGlobalPrefix('/api/:tenantId');

    await appInit(app);

    await spec()
      .get('/api/test/params')
      .expectStatus(200)
      .expectBody({ '0': 'params', tenantId: 'test' });
  });

  afterEach(async () => {
    await app.close();
  });
});
