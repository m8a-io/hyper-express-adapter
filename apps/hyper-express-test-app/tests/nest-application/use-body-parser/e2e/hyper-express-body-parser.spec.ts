import { Test } from '@nestjs/testing';
import { OptionsUrlencoded } from 'body-parser';
import { AppModule } from '../src/app.module';
import { appInit } from '../../../utils/app-init';
import { spec } from 'pactum';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';

describe('Body Parser (Hyper Express Application)', () => {
  const moduleFixture = Test.createTestingModule({
    imports: [AppModule],
  });
  let app: NestHyperExpressApplication;

  describe('application/json', () => {
    const stringLimit = '{ "msg": "Hello, World" }';
    const stringOverLimit = '{ "msg": "Hello, World!" }';

    beforeEach(async () => {
      const testFixture = await moduleFixture.compile();

      app = testFixture
        .createNestApplication<NestHyperExpressApplication>(
          new HyperExpressAdapter(),
          {
            rawBody: true,
            logger: false,
          },
        )
        .useBodyParser('json', { limit: Buffer.from(stringLimit).byteLength });

      await appInit(app);
    });

    it('should allow request with matching body limit', async () => {
      const response = await spec()
        .post('/')
        .withHeaders('Content-Type', 'application/json')
        .withBody(stringLimit)
        .expectStatus(201);

      expect(response.body).toEqual({
        raw: stringLimit,
      });
      afterEach(async () => {
        await app.close();
      });
    });

    it('should fail if post body is larger than limit', async () => {
      await spec()
        .post('/')
        .withHeaders('Content-Type', 'application/json')
        .withBody(stringOverLimit)
        .expectStatus(413);
    });
  });

  describe('application/x-www-form-urlencoded', () => {
    const stringLimit = 'msg=Hello, World';
    const stringOverLimit = 'msg=Hello, World!';

    beforeEach(async () => {
      const testFixture = await moduleFixture.compile();

      app = testFixture
        .createNestApplication<NestHyperExpressApplication>(
          new HyperExpressAdapter(),
          {
            rawBody: true,
            logger: false,
          },
        )
        .useBodyParser<OptionsUrlencoded>('urlencoded', {
          limit: Buffer.from(stringLimit).byteLength,
          extended: true,
        });

      await appInit(app);
    });
    it('should allow request with matching body limit', async () => {
      const response = await spec()
        .post('/')
        .withHeaders('Content-Type', 'application/x-www-form-urlencoded')
        .withBody(stringLimit)
        .expectStatus(201);

      expect(response.body).toEqual({
        raw: stringLimit,
      });
    });

    it('should fail if post body is larger than limit', async () => {
      await spec()
        .post('/')
        .withHeaders('Content-Type', 'application/x-www-form-urlencoded')
        .withBody(stringOverLimit)
        .expectStatus(413);
    });
    afterEach(async () => {
      await app.close();
    });
  });
});
