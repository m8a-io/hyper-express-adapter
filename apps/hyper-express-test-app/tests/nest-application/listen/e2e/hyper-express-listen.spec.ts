import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { HyperExpressAdapter } from '@m8a/platform-hyper-express';

describe('Listen (Express Application)', () => {
  let testModule: TestingModule;
  let app: INestApplication;

  beforeEach(async () => {
    testModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = testModule.createNestApplication(new HyperExpressAdapter());
  });

  afterEach(async () => {
    app.close();
  });

  it('should resolve with httpServer on success', async () => {
    const response = await app.listen(9999);
    expect(response).toEqual(app.getHttpServer());
  });

  it('should reject if the port is not available', async () => {
    await app.listen(9999);
    const secondApp = testModule.createNestApplication(
      new HyperExpressAdapter(),
    );
    try {
      await secondApp.listen(9999);
    } catch (error) {
      expect(error.code).toEqual('EADDRINUSE');
    }
  });

  it('should reject if there is an invalid host', async () => {
    try {
      await app.listen(9999, '1');
    } catch (error) {
      expect(error.code).toEqual('EADDRNOTAVAIL');
    }
  });
});
