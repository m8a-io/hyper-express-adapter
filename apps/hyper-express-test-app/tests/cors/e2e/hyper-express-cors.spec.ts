import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { appInit } from '../../utils/app-init';
import { spec } from 'pactum';
import * as cors from 'cors';
import { config } from 'process';

describe('Hyper-Express Cors', () => {
  let app: NestHyperExpressApplication;
  const configs = [
    {
      origin: 'example.com',
      methods: 'GET',
      credentials: true,
      exposedHeaders: ['foo', 'bar'],
      allowedHeaders: ['baz', 'woo'],
      maxAge: 123,
    },
    {
      origin: 'sample.com',
      methods: 'GET',
      credentials: true,
      exposedHeaders: ['zoo', 'bar'],
      allowedHeaders: ['baz', 'foo'],
      maxAge: 321,
    },
  ];
  describe('Dynamic config', () => {
    describe('enableCors', () => {
      beforeAll(async () => {
        const module = await Test.createTestingModule({
          imports: [AppModule] 
        }).compile();

        app = module.createNestApplication<NestHyperExpressApplication>(
          new HyperExpressAdapter()
        );

        let requestId = 0;
        const configDelegation = function (req, cb) {
          const config = configs[requestId];
          requestId++;
          cb(null, config);
        };
        app.enableCors(configDelegation);

        await appInit(app);
      });

      it(`should add cors headers based on the first config cors-test`, async () => {
        return spec()
          .get('/')
          .expectHeader('access-control-allow-origin', 'example.com')
          .expectHeader('vary', 'Origin')
          .expectHeader('access-control-allow-credentials', 'true')
          .expectHeader('access-control-expose-headers', 'foo,bar')
          .expectHeader('content-length', '0');
      });

      it(`should add cors headers based on the second config`, async () => {
        return spec()
          .options('/')
          .expectHeader('access-control-allow-origin', 'sample.com')
          .expectHeader('vary', 'Origin')
          .expectHeader('access-control-allow-credentials', 'true')
          .expectHeader('access-control-expose-headers', 'zoo,bar')
          .expectHeader('access-control-allow-methods', 'GET')
          .expectHeader('access-control-allow-headers', 'baz,foo')
          .expectHeader('access-control-max-age', '321')
          .expectHeader('content-length', '0');
      });

      afterAll(async () => {
        await app.close();
      });
    });

    describe('Application Options', () => {
      beforeAll(async () => {
        const module = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();

        let requestId = 0;
        const configDelegation = function (req, cb) {
          const config = configs[requestId];
          requestId++;
          cb(null, config);
        };

        app = module.createNestApplication<NestHyperExpressApplication>(
          new HyperExpressAdapter(),
          {
            cors: configDelegation,
          },
        );

        await appInit(app);
      });

      it(`should add cors headers based on the first config`, async () => {
        return spec()
          .get('/')
          .expectHeader('access-control-allow-origin', 'example.com')
          .expectHeader('vary', 'Origin')
          .expectHeader('access-control-allow-credentials', 'true')
          .expectHeader('access-control-expose-headers', 'foo,bar')
          .expectHeader('content-length', '0');
      });

      it(`should add cors headers based on the second config`, async () => {
        return spec()
          .options('/')
          .expectHeader('access-control-allow-origin', 'sample.com')
          .expectHeader('vary', 'Origin')
          .expectHeader('access-control-allow-credentials', 'true')
          .expectHeader('access-control-expose-headers', 'zoo,bar')
          .expectHeader('access-control-allow-methods', 'GET')
          .expectHeader('access-control-allow-headers', 'baz,foo')
          .expectHeader('access-control-max-age', '321')
          .expectHeader('content-length', '0');
      });

      afterAll(async () => {
        await app.close();
      });
    });
  });
  describe('Static config', () => {
    describe('enableCors', () => {
      beforeAll(async () => {
        const module = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();

        app = module.createNestApplication<NestHyperExpressApplication>(
          new HyperExpressAdapter(),
        );
        app.enableCors(configs[0]);

        await appInit(app);
      });

      it(`CORS headers`, async () => {
        return spec()
          .get('/')
          .expectHeader('access-control-allow-origin', 'example.com')
          .expectHeader('vary', 'Origin')
          .expectHeader('access-control-allow-credentials', 'true')
          .expectHeader('access-control-expose-headers', 'foo,bar')
          .expectHeader('content-length', '0');
      });
    });

    afterAll(async () => {
      await app.close();
    });

    describe('Application Options', () => {
      beforeAll(async () => {
        const module = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();

        app = module.createNestApplication<NestHyperExpressApplication>(
          new HyperExpressAdapter(),
          {
            cors: configs[0],
          },
        );
        await appInit(app);
      });

      it(`CORS headers`, async () => {
        return spec()
          .get('/')
          .expectHeader('access-control-allow-origin', 'example.com')
          .expectHeader('vary', 'Origin')
          .expectHeader('access-control-allow-credentials', 'true')
          .expectHeader('access-control-expose-headers', 'foo,bar')
          .expectHeader('content-length', '0');
      });

      afterAll(async () => {
        await app.close();
      });
    });
  });
});
