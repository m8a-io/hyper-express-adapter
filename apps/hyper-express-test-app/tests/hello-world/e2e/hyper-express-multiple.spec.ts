import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { request, spec } from 'pactum';
import { HyperExpressAdapter, NestHyperExpressApplication } from '@m8a/platform-hyper-express';

describe('Hello world (hyper express instance with multiple applications)', () => {
  let apps: NestHyperExpressApplication[];
  process.setMaxListeners(12);

  beforeEach( async () => {
    const module1 = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const module2 = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    apps = [
      module1.createNestApplication<NestHyperExpressApplication>(
        new HyperExpressAdapter()
      ),
  
      module2.createNestApplication<NestHyperExpressApplication>(
        new HyperExpressAdapter()
      ).setGlobalPrefix('/app2')
    ]

    apps.map(async (app, index) => {
      await app.listen(9998 + index);
      const url = await app.getUrl();
      request.setBaseUrl(
        url
          .replace('+unix', '')
          .replace('%3A', ':'),
      );
    });   
  });

  it(`/GET`, () => {
    return spec().get('/hello').expectStatus(200).expectBody('Hello world!');
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
    apps.map(async (app) => {
      await app.close();
    });
  });
});
