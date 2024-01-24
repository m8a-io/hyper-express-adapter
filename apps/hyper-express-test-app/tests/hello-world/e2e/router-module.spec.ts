import { NestHyperExpressApplication } from '@m8a/platform-hyper-express';
import { Controller, Get, Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { HyperExpressAdapter } from '@m8a/platform-hyper-express/src/adapters/hyper-express-adapter';
import { appInit } from '../../utils/app-init';
import { spec } from 'pactum';

describe('RouterModule', () => {
  let app: NestHyperExpressApplication;

  abstract class BaseController {
    @Get()
    getName() {
      return this.constructor.name;
    }
  }

  @Controller('/parent-controller')
  class ParentController extends BaseController {}

  @Controller('/child-controller')
  class ChildController extends BaseController {}

  @Controller('no-slash-controller')
  class NoSlashController extends BaseController {}

  @Module({ controllers: [ParentController] })
  class ParentModule {}

  @Module({ controllers: [ChildController] })
  class ChildModule {}

  @Module({})
  class AuthModule {}

  @Module({})
  class PaymentsModule {}

  @Module({ controllers: [NoSlashController] })
  class NoSlashModule {}

  const routes1: Routes = [
    {
      path: 'parent',
      module: ParentModule,
      children: [
        {
          path: 'child',
          module: ChildModule,
        },
      ],
    },
  ];
  const routes2: Routes = [
    { path: 'v1', children: [AuthModule, PaymentsModule, NoSlashModule] },
  ];

  @Module({
    imports: [ParentModule, ChildModule, RouterModule.register(routes1)],
  })
  class MainModule {}

  @Module({
    imports: [
      AuthModule,
      PaymentsModule,
      NoSlashModule,
      RouterModule.register(routes2),
    ],
  })
  class AppModule {}

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [MainModule, AppModule],
    }).compile();

    app = moduleRef.createNestApplication<NestHyperExpressApplication>(
      new HyperExpressAdapter(),
    );

    await appInit(app);
  });

  it('should hit the "ParentController"', async () => {
    await spec()
      .get('/parent/parent-controller')
      .expectStatus(200)
      .expectBody('ParentController');
  });

  it('should hit the "ChildController"', async () => {
    await spec()
      .get('/parent/child/child-controller')
      .expectStatus(200)
      .expectBody('ChildController');
  });

  it('should hit the "NoSlashController"', async () => {
    return await spec()
      .get('/v1/no-slash-controller')
      .expectStatus(200)
      .expectBody('NoSlashController');
  });

  afterEach(async () => {
    await app.close();
  });
});
