import {
  Controller,
  Get,
  MiddlewareConsumer,
  Module,
  RequestMethod,
  Version,
  VersioningOptions,
  VersioningType,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { CustomVersioningOptions } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { spec } from 'pactum';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';
import { appInit } from '../../utils/app-init';

const RETURN_VALUE = 'test';
const VERSIONED_VALUE = 'test_versioned';

@Controller()
class TestController {
  @Version('1')
  @Get('versioned')
  versionedTest() {
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
      .apply((req, res, next) => res.send(VERSIONED_VALUE))
      .forRoutes({
        path: '/versioned',
        version: '1',
        method: RequestMethod.ALL,
      });
  }
}

describe('Middleware', () => {
  let app: NestHyperExpressApplication;

  describe('when using default URI versioning', () => {
    beforeEach(async () => {
      app = await createAppWithVersioning({
        type: VersioningType.URI,
        defaultVersion: VERSION_NEUTRAL,
      });
    });

    it(`forRoutes({ path: '/versioned', version: '1', method: RequestMethod.ALL })`, async () => {
      return await spec()
        .get('/v1/versioned')
        .expectStatus(200)
        .expectBody(VERSIONED_VALUE);
    });
  });

  describe('when default URI versioning with an alternative prefix', () => {
    beforeEach(async () => {
      app = await createAppWithVersioning({
        type: VersioningType.URI,
        defaultVersion: VERSION_NEUTRAL,
        prefix: 'version',
      });
    });

    it(`forRoutes({ path: '/versioned', version: '1', method: RequestMethod.ALL })`, async () => {
      return await spec()
        .get('/version1/versioned')
        .expectStatus(200)
        .expectBody(VERSIONED_VALUE);
    });
  });

  describe('when using default URI versioning with the global prefix', () => {
    beforeEach(async () => {
      app = await createAppWithVersioning(
        {
          type: VersioningType.URI,
          defaultVersion: VERSION_NEUTRAL,
        },
        async (app: NestHyperExpressApplication) => {
          app.setGlobalPrefix('api');
        },
      );
    });

    it(`forRoutes({ path: '/versioned', version: '1', method: RequestMethod.ALL })`, async () => {
      return await spec()
        .get('/api/v1/versioned')
        .expectStatus(200)
        .expectBody(VERSIONED_VALUE);
    });
  });

  describe('when using HEADER versioning', () => {
    beforeEach(async () => {
      app = await createAppWithVersioning({
        type: VersioningType.HEADER,
        header: 'version',
      });
    });

    it(`forRoutes({ path: '/versioned', version: '1', method: RequestMethod.ALL })`, async () => {
      return await spec()
        .get('/versioned')
        .withHeaders('version', '1')
        .expectStatus(200)
        .expectBody(VERSIONED_VALUE);
    });
  });

  describe('when using MEDIA TYPE versioning', () => {
    beforeEach(async () => {
      app = await createAppWithVersioning({
        type: VersioningType.MEDIA_TYPE,
        key: 'v',
        defaultVersion: VERSION_NEUTRAL,
      });
    });

    it(`forRoutes({ path: '/versioned', version: '1', method: RequestMethod.ALL })`, async () => {
      return await spec()
        .get('/versioned')
        .expectStatus(200)
        .expectBody(VERSIONED_VALUE);
    });
  });

  describe('when using CUSTOM TYPE versioning', () => {
    beforeEach(async () => {
      const extractor: CustomVersioningOptions['extractor'] = () => '1';

      app = await createAppWithVersioning({
        type: VersioningType.CUSTOM,
        extractor,
      });
    });

    it(`forRoutes({ path: '/versioned', version: '1', method: RequestMethod.ALL })`, async () => {
      return await spec()
        .get('/versioned')
        .expectStatus(200)
        .expectBody(VERSIONED_VALUE);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});

async function createAppWithVersioning(
  versioningOptions: VersioningOptions,
  beforeInit?: (app: NestHyperExpressApplication) => Promise<void>,
): Promise<NestHyperExpressApplication> {
  const app = (
    await Test.createTestingModule({
      imports: [TestModule],
    }).compile()
  ).createNestApplication<NestHyperExpressApplication>(
    new HyperExpressAdapter(),
  );

  app.enableVersioning(versioningOptions);
  if (beforeInit) {
    await beforeInit(app);
  }
  await appInit(app);

  return app;
}
