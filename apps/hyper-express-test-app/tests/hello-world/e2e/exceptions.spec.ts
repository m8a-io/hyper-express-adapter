import { HttpStatus } from '@nestjs/common';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';
import { Test } from '@nestjs/testing';
import { request, spec } from 'pactum';
import { ErrorsController } from '../src/errors/errors.controller';

describe('Error messages', () => {
  describe('Hyper-Express', () => {
    let app: NestHyperExpressApplication;
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        controllers: [ErrorsController],
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

    it(`/GET`, () => {
      return spec()
        .get('/sync')
        .expectStatus(HttpStatus.BAD_REQUEST)
        .expectBody({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Integration test',
        });
    });

    it(`/GET (Promise/async)`, () => {
      return spec()
        .get('/async')
        .expectStatus(HttpStatus.BAD_REQUEST)
        .expectBody({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Integration test',
        });
    });

    it(`/GET (InternalServerError despite custom content-type)`, () => {
      return spec()
        .get('/unexpected-error')
        .expectStatus(HttpStatus.INTERNAL_SERVER_ERROR)
        .expectBodyContains({
          statusCode: 500,
          message: 'Internal server error',
        });
    });

    afterEach(async () => {
      await app.close();
    });
  });
});
