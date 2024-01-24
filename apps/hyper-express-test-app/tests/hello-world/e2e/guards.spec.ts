import { Injectable, UnauthorizedException } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';
import { spec } from 'pactum';
import { appInit } from '../../utils/app-init';

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
    app = (await createTestModule(new AuthGuard())).createNestApplication(
      new HyperExpressAdapter(),
    );
    await appInit(app);
    return spec().get('/hello').expectStatus(401);
  });

  afterEach(async () => {
    await app.close();
  });
});
