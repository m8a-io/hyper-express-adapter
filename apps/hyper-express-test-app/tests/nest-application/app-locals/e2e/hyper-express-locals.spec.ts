import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { request, spec } from 'pactum';
import { HyperExpressAdapter, NestHyperExpressApplication } from '@m8a/platform-hyper-express';

describe('App-level globals (Express Application)', () => {
  let module: TestingModule;
  let app: NestHyperExpressApplication;

  beforeEach(async () => {
    module = await Test.createTestingModule({
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

  it('should get "title" from "app.locals"', async () => {
    app.setLocal('title', 'My Website');
    await spec()
      .get('/')
      .expectStatus(200)
      .expectBodyContains('My Website');
  });

  it('should get "email" from "app.locals"', async () => {
    app.setLocal('email', 'admin@example.com');
    spec()
      .get('/')
      .expectStatus(200)
      .expectBodyContains('admin@example.com');
  });

  afterEach(async () => {
    await app.close();
  });
});
