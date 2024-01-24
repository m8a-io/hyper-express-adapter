import { Test } from '@nestjs/testing';
import { ExpressModule } from '../src/express.module';
import { HyperExpressAdapter } from '@m8a/platform-hyper-express';
import { appInit } from '../../../utils/app-init';
import { NestHyperExpressApplication } from '@m8a/platform-hyper-express';
import { spec } from 'pactum';

describe('Raw body (Express Application)', () => {
  let app: NestHyperExpressApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ExpressModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestHyperExpressApplication>(
      new HyperExpressAdapter(),
      {
        rawBody: true,
      },
    );

    await appInit(app);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('application/json', () => {
    const body = '{ "amount":0.0 }';

    it('should return exact post body', async () => {
      const response = await spec()
        .post('/')
        .withHeaders('Content-Type', 'application/json')
        .withBody(body)
        .expectStatus(201);
      console.log('response: ', response);
      expect(response.body).toEqual({
        parsed: {
          amount: 0,
        },
        raw: body,
      });
    });

    it('should work if post body is empty', async () => {
      await spec()
        .post('/')
        .withHeaders('Content-Type', 'application/json')
        .expectStatus(201);
    });
  });

  describe('application/x-www-form-urlencoded', () => {
    const body = 'content=this is a post\'s content by "Nest"';

    it('should return exact post body', async () => {
      const response = await spec()
        .post('/')
        .withHeaders('Content-Type', 'application/x-www-form-urlencoded')
        .withBody(body)
        .expectStatus(201);

      expect(response.body).toEqual({
        parsed: {
          content: 'this is a post\'s content by "Nest"',
        },
        raw: body,
      });
    });

    it('should work if post body is empty', async () => {
      await spec()
        .post('/')
        .withHeaders('Content-Type', 'application/x-www-form-urlencoded')
        .expectStatus(201);
    });
  });
});
