import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppModule } from '../src/app.module';
import { request, spec } from 'pactum';
import { HyperExpressAdapter, NestHyperExpressApplication } from '@m8a/platform-hyper-express';

const RETURN_VALUE = 'test';

@Injectable()
export class OverrideInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return of(RETURN_VALUE);
  }
}

@Injectable()
export class TransformInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map(data => ({ data })));
  }
}

@Injectable()
export class StatusInterceptor {
  constructor(private readonly statusCode: number) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse();
    res.status(this.statusCode);
    return next.handle().pipe(map(data => ({ data })));
  }
}

@Injectable()
export class HeaderInterceptor {
  constructor(private readonly headers: object) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse();
    for (const key in this.headers) {
      if (this.headers.hasOwnProperty(key)) {
        res.header(key, this.headers[key]);
      }
    }
    return next.handle().pipe(map(data => ({ data })));
  }
}

function createTestModule(interceptor) {
  return Test.createTestingModule({
    imports: [AppModule],
    providers: [
      {
        provide: APP_INTERCEPTOR,
        useValue: interceptor,
      },
    ],
  }).compile();
}

describe('Interceptors', () => {
  let app: NestHyperExpressApplication;

  it(`should transform response (sync)`, async () => {
    app = (
      await createTestModule(new OverrideInterceptor())
    ).createNestApplication(new HyperExpressAdapter());

    await app.listen(9999);
    const url = await app.getUrl();
    request.setBaseUrl(
      url.replace('::1', '127.0.0.1').replace('+unix', '').replace('%3A', ':'),
    );
    return spec().get('/hello').expectStatus(200).expectBody(RETURN_VALUE);
  });

  it(`should map response`, async () => {
    app = (
      await createTestModule(new TransformInterceptor())
    ).createNestApplication();

    await app.listen(9999);
    return spec()
      .get('/hello')
      .expectStatus(200)
      .expectBody({ data: 'Hello world!' });
  });

  it(`should map response (async)`, async () => {
    app = (
      await createTestModule(new TransformInterceptor())
    ).createNestApplication(
      new HyperExpressAdapter(),
    );

    await app.listen(9999);
    const url = await app.getUrl();
    request.setBaseUrl(
      url.replace('::1', '127.0.0.1').replace('+unix', '').replace('%3A', ':'),
    );
    return spec()
      .get('/hello/stream')
      .expectStatus(200)
      .expectBody({ data: 'Hello world!' });
  });

  it(`should map response (stream)`, async () => {
    app = (
      await createTestModule(new TransformInterceptor())
    ).createNestApplication(
      new HyperExpressAdapter(),
    );

    await app.listen(9999);
    const url = await app.getUrl();
    request.setBaseUrl(
      url.replace('::1', '127.0.0.1').replace('+unix', '').replace('%3A', ':'),
    );
    return spec()
      .get('/hello/async')
      .expectStatus(200)
      .expectBody({ data: 'Hello world!' });
  });

  it(`should modify response status`, async () => {
    app = (
      await createTestModule(new TransformInterceptor())
    ).createNestApplication(
      new HyperExpressAdapter(),
    );

    await app.listen(9999);
    const url = await app.getUrl();
    request.setBaseUrl(
      url.replace('::1', '127.0.0.1').replace('+unix', '').replace('%3A', ':'),
    );
    return spec()
      .get('/hello')
      .expectStatus(400)
      .expectBody({ data: 'Hello world!' });
  });

  it(`should modify Authorization header`, async () => {
    const customHeaders = {
      Authorization: 'jwt',
    };

    app = (
      await createTestModule(new TransformInterceptor())
    ).createNestApplication(
      new HyperExpressAdapter(),
    );

    await app.listen(9999);
    const url = await app.getUrl();
    request.setBaseUrl(
      url.replace('::1', '127.0.0.1').replace('+unix', '').replace('%3A', ':'),
    );
    const _spec = await spec().get('/hello').toss();
    console.log('_spec', _spec);
    return spec()
      .get('/hello')
      .expectStatus(200)
      .expectHeader('authorization', 'Bearer');
  });

  afterEach(async () => {
    await app.close();
  });
});
