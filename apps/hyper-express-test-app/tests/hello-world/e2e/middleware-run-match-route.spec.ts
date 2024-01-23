import {
  Controller,
  Get,
  Injectable,
  MiddlewareConsumer,
  NestMiddleware,
  Module,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { appInit } from '../../utils/app-init';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';
import { spec } from 'pactum';

/**
 * Number of times that the middleware was executed.
 */
let triggerCounter = 0;
@Injectable()
class Middleware implements NestMiddleware {
  use(req, res, next) {
    triggerCounter++;
    next();
  }
}

@Controller()
class TestController {
  @Get('/test')
  testA() {}

  @Get('/:id')
  testB() {}

  @Get('/static/route')
  testC() {}

  @Get('/:id/:nested')
  testD() {}
}

@Module({
  controllers: [TestController],
})
class TestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Middleware).forRoutes(TestController);
  }
}

describe('Middleware (run on route match)', () => {
  let app: NestHyperExpressApplication;

  beforeEach(async () => {
    triggerCounter = 0;
    app = (
      await Test.createTestingModule({
        imports: [TestModule],
      }).compile()
    ).createNestApplication(new HyperExpressAdapter());

    await appInit(app);
  });

  it(`forRoutes(TestController) should execute middleware once when request url is equal match`, async () => {
    return await spec()
      .get('/test')
      .expectStatus(200)
      .toss()
      .then((res) => {
        expect(res.triggerCounter).toBe(1);
      });
  });

  it(`forRoutes(TestController) should execute middleware once when request url is not equal match`, async () => {
    return await spec()
      .get('/1')
      .expectStatus(200)
      .toss()
      .then(() => {
        expect(triggerCounter).toBe(1);
      });
  });

  it(`forRoutes(TestController) should execute middleware once when request url is not of nested params`, async () => {
    return await spec()
      .get('/static/route')
      .expectStatus(200)
      .toss()
      .then(() => {
        expect(triggerCounter).toBe(1);
      });
  });

  it(`forRoutes(TestController) should execute middleware once when request url is of nested params`, async () => {
    return await spec()
      .get('/1/abc')
      .expectStatus(200)
      .toss()
      .then(() => {
        expect(triggerCounter).toBe(1);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
