import {
  Controller,
  Get,
  Injectable,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { Response } from 'express';
import { spec } from 'pactum';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';
import { appInit } from '../../utils/app-init';

const INCLUDED_VALUE = 'test_included';
const RETURN_VALUE = 'test';
const WILDCARD_VALUE = 'test_wildcard';

@Injectable()
class Middleware {
  use(req, res, next) {
    res.send(WILDCARD_VALUE);
  }
}

@Controller()
class TestController {
  @Get('test')
  test() {
    return RETURN_VALUE;
  }
}

@Module({
  imports: [AppModule],
  controllers: [TestController],
})
class TestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res: Response, next) => res.status(201).end(INCLUDED_VALUE))
      .forRoutes({ path: 'tests/included', method: RequestMethod.POST })
      .apply(Middleware)
      .forRoutes('*');
  }
}

describe('Middleware (class)', () => {
  let app: NestHyperExpressApplication;

  beforeEach(async () => {
    app = (
      await Test.createTestingModule({
        imports: [TestModule],
      }).compile()
    ).createNestApplication(new HyperExpressAdapter());

    await appInit(app);
  });

  it(`forRoutes(*)`, () => {
    return spec().get('/hello').expectStatus(200).expectBody(WILDCARD_VALUE);
  });

  it(`/test forRoutes(*)`, () => {
    return spec().get('/test').expectStatus(200).expectBody(WILDCARD_VALUE);
  });

  it(`GET forRoutes(POST tests/included)`, () => {
    return spec()
      .get('/tests/included')
      .expectStatus(200)
      .expectBody(WILDCARD_VALUE);
  });

  it(`POST forRoutes(POST tests/included)`, () => {
    return spec()
      .post('/tests/included')
      .expectStatus(201)
      .expectBody(INCLUDED_VALUE);
  });

  afterEach(async () => {
    await app.close();
  });
});
