import { Controller, Get, MiddlewareConsumer, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { appInit } from '../../utils/app-init';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';
import { spec } from 'pactum';

const RETURN_VALUE = 'test';
const SCOPED_VALUE = 'test_scoped';

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
}

@Module({
  imports: [AppModule],
  controllers: [TestController],
})
class TestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => res.send(SCOPED_VALUE))
      .forRoutes(TestController);
  }
}

describe('RouterModule with Middleware functions', () => {
  let app: NestHyperExpressApplication;

  beforeEach(async () => {
    app = (
      await Test.createTestingModule({
        imports: [
          TestModule,
          RouterModule.register([
            {
              path: '/module-path/',
              module: TestModule,
            },
          ]),
        ],
      }).compile()
    ).createNestApplication(new HyperExpressAdapter());

    await appInit(app);
  });

  it(`forRoutes(TestController) - /test`, () => {
    return spec()
      .get('/module-path/test')
      .expectStatus(200)
      .expectBody(SCOPED_VALUE);
  });

  it(`forRoutes(TestController) - /test2`, () => {
    return spec()
      .get('/module-path/test2')
      .expectStatus(200)
      .expectBody(SCOPED_VALUE);
  });

  afterEach(async () => {
    await app.close();
  });
});
