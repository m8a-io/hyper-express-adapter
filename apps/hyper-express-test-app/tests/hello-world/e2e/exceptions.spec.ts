import { HttpStatus } from '@nestjs/common';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';
import { Test } from '@nestjs/testing';
import { spec } from 'pactum';
import { ErrorsController } from '../src/errors/errors.controller';
import { appInit } from '../../utils/app-init';

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

      await appInit(app);
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
