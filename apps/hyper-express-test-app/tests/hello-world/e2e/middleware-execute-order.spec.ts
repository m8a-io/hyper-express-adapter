import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { request, spec } from 'pactum';

const RETURN_VALUE_A = 'test_A';
const RETURN_VALUE_B = 'test_B';

@Module({
  imports: [],
})
class ModuleA {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        res.send(RETURN_VALUE_A);
      })
      .forRoutes('hello');
  }
}

@Module({
  imports: [ModuleA],
})
class ModuleB {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        res.send(RETURN_VALUE_B);
      })
      .forRoutes('hello');
  }
}

@Module({
  imports: [ModuleB],
})
class TestModule {}

describe('Middleware (execution order)', () => {
  let app: NestHyperExpressApplication;

  beforeEach(async () => {
    app = (
      await Test.createTestingModule({
        imports: [TestModule],
      }).compile()
    ).createNestApplication(new HyperExpressAdapter());

    await app.listen(9999);
    const url = await app.getUrl();
    request.setBaseUrl(
      url.replace('::1', '127.0.0.1').replace('+unix', '').replace('%3A', ':'),
    );
  });

  it(`should execute middleware in topological order`, () => {
    return spec().get('/hello').expectStatus(200).expectBody(RETURN_VALUE_B);
  });

  afterEach(async () => {
    await app.close();
  });
});
