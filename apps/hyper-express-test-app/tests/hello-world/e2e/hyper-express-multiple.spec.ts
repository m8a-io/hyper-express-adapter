import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { spec } from 'pactum';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';
import { appInit } from '../../utils/app-init';

describe('Hello world (hyper express instance with multiple applications)', () => {
  let apps: NestHyperExpressApplication[];
  process.setMaxListeners(12);

  beforeEach(async () => {
    const module1 = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const module2 = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const adapter = new HyperExpressAdapter();
    apps = [
      module1.createNestApplication<NestHyperExpressApplication>(
        new HyperExpressAdapter(),
      ),
      module2.createNestApplication<NestHyperExpressApplication>(
        new HyperExpressAdapter(),
    ).setGlobalPrefix('/app2')];

    await Promise.all(apps.map(async (app, index) => {
      appInit(app, 9998 + index);
      })
    );
  });

  it(`/GET test1`, async () => {
    return await spec()
      .get('http:127.0.0.1:9998/hello')
      .expectStatus(200)
      .expectBody('Hello world!');
  });

  it(`/GET (app2)`, async () => {
    return await spec()
      .get('http://127.0.0.1:9999/app2/hello')
      .expectStatus(200)
      .expectBody('Hello world!');
  });

  it(`/GET (Promise/async)`, async () => {
    return await spec()
      .get('http://127.0.0.1:9998/hello/async')
      .expectStatus(200)
      .expectBody('Hello world!');
  });

  it(`/GET (app2 Promise/async)`, async () => {
    return await spec()
      .get('http://127.0.0.1:9999/app2/hello/async')
      .expectStatus(200)
      .expectBody('Hello world!');
  });

  it(`/GET (Observable stream)`, async () => {
    return await spec()
      .get('http://127.0.0.1:9998/hello/stream')
      .expectStatus(200)
      .expectBody('Hello world!');
  });

  it(`/GET (app2 Observable stream)`, async () => {
    return await spec()
      .get('http://127.0.0.1:9999/app2/hello/stream')
      .expectStatus(200)
      .expectBody('Hello world!');
  });

  afterEach(async () => {
    apps.map(async (app) => {
      await app.close();
    });
  });
});
