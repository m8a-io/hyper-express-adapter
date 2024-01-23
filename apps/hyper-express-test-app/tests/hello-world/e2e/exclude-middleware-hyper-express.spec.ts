import {
  Controller,
  Get,
  MiddlewareConsumer,
  Module,
  Post,
  RequestMethod,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { spec } from 'pactum';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';
import { appInit } from '../../utils/app-init';

const RETURN_VALUE = 'test';
const MIDDLEWARE_VALUE = 'middleware';

@Controller()
class TestController {
  @Get('test')
  test() {
    return RETURN_VALUE;
  }

  @Get('test2')
  test2() {
    return RETURN_VALUE;
  }

  @Get('middleware')
  middleware() {
    return RETURN_VALUE;
  }

  @Post('middleware')
  noMiddleware() {
    return RETURN_VALUE;
  }

  @Get('wildcard/overview')
  testOverview() {
    return RETURN_VALUE;
  }

  @Get('overview/:id')
  overviewById() {
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
      .apply((req, res, next) => res.send(MIDDLEWARE_VALUE))
      .exclude('test', 'overview/:id', 'wildcard/(.*)', {
        path: 'middleware',
        method: RequestMethod.POST,
      })
      .forRoutes('*');
  }
}

describe('Exclude middleware', () => {
  let app: NestHyperExpressApplication;
  beforeEach(async () => {
    app = (
      await Test.createTestingModule({
        imports: [TestModule],
      }).compile()
    ).createNestApplication(new HyperExpressAdapter());

    await appInit(app);
  });

  it(`should exclude "/test" endpoint`, () => {
    return spec().get('/test').expectStatus(200).expectBody(RETURN_VALUE);
  });

  it(`should not exclude "/test2" endpoint`, () => {
    return spec().get('/test2').expectStatus(200).expectBody(MIDDLEWARE_VALUE);
  });

  it(`should run middleware for "/middleware" endpoint`, () => {
    return spec().get('/middleware').expectBody('');
  });

  it(`should exclude POST "/middleware" endpoint`, () => {
    return spec()
      .post('/middleware')
      .expectStatus(201)
      .expectBody(RETURN_VALUE);
  });

  it(`should exclude "/overview/:id" endpoint (by param)`, () => {
    return spec().get('/overview/1').expectStatus(200).expectBody(RETURN_VALUE);
  });

  it(`should exclude "/wildcard/overview" endpoint (by wildcard)`, () => {
    return spec()
      .get('/wildcard/overview')
      .expectStatus(200)
      .expectBody(RETURN_VALUE);
  });

  afterEach(async () => {
    await app.close();
  });
});
