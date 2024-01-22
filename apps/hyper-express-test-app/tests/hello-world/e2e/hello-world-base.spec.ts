import { Test } from '@nestjs/testing';
import { request, spec } from 'pactum';
import { HyperExpressAdapter, NestHyperExpressApplication } from '@m8a/platform-hyper-express';
import { AppModule } from '../src/app.module';

describe('Hello world (default adapter)', () => {
  let server;
  let app: NestHyperExpressApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication(
      new HyperExpressAdapter(),
    );
    await app.listen(9999);
    const url = await app.getUrl();
      request.setBaseUrl(
        url.replace('::1', '127.0.0.1').replace('+unix', '').replace('%3A', ':'),
      );
  });

  [
    {
      host: 'example.com',
      path: '/hello',
      greeting: 'Hello world!',
    },
    {
      host: 'acme.example.com',
      path: '/host',
      greeting: 'Host Greeting! tenant=acme',
    },
    {
      host: 'acme.example1.com',
      path: '/host-array',
      greeting: 'Host Greeting! tenant=acme',
    },
    {
      host: 'acme.example2.com',
      path: '/host-array',
      greeting: 'Host Greeting! tenant=acme',
    },
  ].forEach(({ host, path, greeting }) => {
    describe(`host=${host}`, () => {
      describe('/GET', () => {
        it(`should return "${greeting}"`, () => {
          return spec()
            .get(path)
            .withHeaders('Host', host)
            .expectStatus(200)
            .expectBody(greeting);
        });

        it(`should attach response header`, async () => {
          return await spec()
            .get(path)
            .withHeaders('Host', host)
            .expectStatus(200)
            .expectHeader('authorization', 'Bearer');

        });
      });

      it(`/GET (Promise/async) returns "${greeting}"`, () => {
        return spec()
          .get(`${path}/async`)
          .withHeaders('Host', host)
          .expectStatus(200)
          .expectBody(greeting);
        
        
      });

      it(`/GET (Observable stream) "${greeting}"`, () => {
        return spec()
          .get(`${path}/stream`)
          .withHeaders('Host', host)
          .expectStatus(200)
          .expectBody(greeting);
      });
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
