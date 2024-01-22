import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HyperExpressAdapter, NestHyperExpressApplication } from '@m8a/platform-hyper-express';
import { request, spec } from 'pactum';

@Injectable()
export class AuthGuard {
  canActivate() {
    const x = true;
    if (x) {
      throw new UnauthorizedException();
    }
  }
}

function createTestModule(guard) {
  return Test.createTestingModule({
    imports: [AppModule],
    providers: [
      {
        provide: APP_GUARD,
        useValue: guard,
      },
    ],
  }).compile();
}

describe('Guards', () => {
  let app: NestHyperExpressApplication;

  it(`should prevent access (unauthorized)`, async () => {
    app = (await createTestModule(new AuthGuard()))
      .createNestApplication(
        new HyperExpressAdapter(),
      );
    await app.listen(9999);
    const url = await app.getUrl();
      request.setBaseUrl(
        url.replace('::1', '127.0.0.1').replace('+unix', '').replace('%3A', ':'),
      );

    return spec().get('/hello').expectStatus(401);
  });

  afterEach(async () => {
     await app.close();
  });
  
});
