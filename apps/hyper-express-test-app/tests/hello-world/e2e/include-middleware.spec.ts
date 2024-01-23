import { Controller, Get, MiddlewareConsumer, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';
import { spec } from 'pactum';
import { appInit } from '../../utils/app-init';

const RETURN_VALUE = 'test';
const SCOPED_VALUE = 'test_scoped';
const WILDCARD_VALUE = 'test_wildcard';
const EXCLUDE_VALUE = 'test_exclude';

@Controller()
class TestController {
  @Get('test')
  test() {
    return RETURN_VALUE;
  }

  @Get('tests/wildcard_nested')
  wildcard_nested() {
    return RETURN_VALUE;
  }

  @Get('exclude')
  exclude() {
    return EXCLUDE_VALUE;
  }
}

@Module({
  imports: [AppModule],
  controllers: [TestController],
})
class TestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => res.send(WILDCARD_VALUE))
      .forRoutes('tests/*')
      .apply((req, res, next) => res.send(SCOPED_VALUE))
      .exclude('exclude')
      .forRoutes(TestController)
      .apply((req, res, next) => res.send(RETURN_VALUE))
      .exclude('exclude')
      .forRoutes('*');
  }
}

describe('Middleware', () => {
  let app: NestHyperExpressApplication;

  it(`forRoutes special`, async () => {
    app = await createApp();
    await spec().get('/hello').expectStatus(200).expectBody(RETURN_VALUE);
    await spec().get('/exclude').expectStatus(200).expectBody(EXCLUDE_VALUE);
    await app.close();
  });

  it(`forRoutes(*) with global prefix`, async () => {
    app = await createApp((app) => app.setGlobalPrefix('api'));
    await spec().get('/api/hello').expectStatus(200).expectBody(RETURN_VALUE);
    spec().get('/api/exclude').expectStatus(200).expectBody(EXCLUDE_VALUE);
    await app.close();
  });

  it(`forRoutes(TestController)`, async () => {
    app = await createApp();
    await spec().get('/test').expectStatus(200).expectBody(SCOPED_VALUE);
    await spec().get('/exclude').expectStatus(200).expectBody(EXCLUDE_VALUE);
    await app.close();
  });

  it(`forRoutes(tests/*)`, async () => {
    app = await createApp();
    await spec()
      .get('/tests/wildcard')
      .expectStatus(200)
      .expectBody(WILDCARD_VALUE);
    await app.close();
  });

  // afterEach(async () => {
  //   await app.close();
  // });
});

async function createApp(
  beforeInit?: (app: NestHyperExpressApplication) => void,
): Promise<NestHyperExpressApplication> {
  const app = (
    await Test.createTestingModule({
      imports: [TestModule],
    }).compile()
  ).createNestApplication<NestHyperExpressApplication>(
    new HyperExpressAdapter(),
  );

  if (beforeInit) {
    beforeInit(app);
  }
  await appInit(app);

  return app;
}
