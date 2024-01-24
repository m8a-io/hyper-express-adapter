import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { spec } from 'pactum';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';
import { appInit } from '../../utils/app-init';

describe('Hello world (hyper express instance with multiple applications)', () => {
  let app1: NestHyperExpressApplication;
  let app2: NestHyperExpressApplication;
  process.setMaxListeners(12);

  beforeEach(async () => {
    const module1 = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const module2 = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app1 = module1.createNestApplication<NestHyperExpressApplication>(
      new HyperExpressAdapter(),
    );
    app2 = module2.createNestApplication<NestHyperExpressApplication>(
      new HyperExpressAdapter(),
    );
    app2.setGlobalPrefix('/app2');
    appInit(app1);
    appInit(app2);
    // apps.map(async (app, index) => {
    //   appInit(app, 9998 + index);
    // });
  });

  it(`/GET`, async () => {
    const _spec = await spec().get('/hello');
    console.log('_spec', _spec);
    return await spec()
      .get('/hello')
      .expectStatus(200)
      .expectBody('Hello world!');
  });

  it(`/GET (app2)`, () => {
    return spec()
      .get('/app2/hello')
      .expectStatus(200)
      .expectBody('Hello world!');
  });

  it(`/GET (Promise/async)`, () => {
    return spec()
      .get('/hello/async')
      .expectStatus(200)
      .expectBody('Hello world!');
  });

  it(`/GET (app2 Promise/async)`, () => {
    return spec()
      .get('/app2/hello/async')
      .expectStatus(200)
      .expectBody('Hello world!');
  });

  it(`/GET (Observable stream)`, () => {
    return spec()
      .get('/hello/stream')
      .expectStatus(200)
      .expectBody('Hello world!');
  });

  it(`/GET (app2 Observable stream)`, () => {
    return spec()
      .get('/app2/hello/stream')
      .expectStatus(200)
      .expectBody('Hello world!');
  });

  afterEach(async () => {
    // apps.map(async (app) => {
    //   await app.close();
    // });
    await app1.close();
    await app2.close();
  });
});
