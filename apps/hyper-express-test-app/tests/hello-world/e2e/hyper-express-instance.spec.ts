import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { request, spec } from 'pactum';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';

describe('Hello world (hyper-express instance)', () => {
  let app: NestHyperExpressApplication;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication<NestHyperExpressApplication>(
      new HyperExpressAdapter(),
    );

    await app.listen(9999);
    const url = await app.getUrl();
    request.setBaseUrl(
      url.replace('::1', '127.0.0.1').replace('+unix', '').replace('%3A', ':'),
    );
  });

  it(`/GET`, async () => {
    return await spec()
      .get('/hello')
      .expectStatus(200)
      .expectBody('Hello world!');
  });

  it(`/GET (Promise/async)`, async () => {
    return await spec()
      .get('/hello/async')
      .expectStatus(200)
      .expectBody('Hello world!');
  });

  it(`/GET (Observable stream)`, async () => {
    return await spec()
      .get('/hello/stream')
      .expectStatus(200)
      .expectBody('Hello world!');
  });

  it(`/GET { host: ":tenant.example.com" } not matched`, async () => {
    return await spec().get('/host').expectStatus(500).expectJson({
      statusCode: 404,
      error: 'Not Found',
      message: 'Cannot GET /host',
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
