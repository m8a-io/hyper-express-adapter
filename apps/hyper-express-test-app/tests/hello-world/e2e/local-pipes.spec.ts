import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { spec } from 'pactum';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';
import { appInit } from '../../utils/app-init';

describe('Hello world (default adapter)', () => {
  let app: NestHyperExpressApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication<NestHyperExpressApplication>(
      new HyperExpressAdapter(),
    );

    await appInit(app);
  });

  it(`host=example.com should execute locally injected pipe by HelloController`, () => {
    return spec().get('/hello/local-pipe/1').expectStatus(200).expectBody({
      id: '1',
    });
  });

  it(`host=host.example.com should execute locally injected pipe by HostController`, () => {
    return spec()
      .get('/host/local-pipe/1')
      .withHeaders('Host', 'acme.example.com')
      .expectStatus(200)
      .expectBody({
        id: '1',
        host: true,
        tenant: 'acme',
      });
  });

  it(`should return 404 for mismatched host`, () => {
    return spec().get('/host/local-pipe/1').expectStatus(404).expectBody({
      error: 'Not Found',
      message: 'Cannot GET /host/local-pipe/1',
      statusCode: 404,
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
