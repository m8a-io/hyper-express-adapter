import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { randomPort } from './utils';
import { appInit } from '../../../utils/app-init';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';

describe('Get URL (Express Application)', () => {
  let testModule: TestingModule;
  let port: number;
  let app: NestHyperExpressApplication;

  beforeEach(async () => {
    testModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  beforeEach(async () => {
    port = await randomPort();
  });

  it('should be able to get the IPv6 address', async () => {
    app = testModule.createNestApplication<NestHyperExpressApplication>(
      new HyperExpressAdapter(),
    );
    await appInit(app, port);
    expect(await app.getUrl()).toBe(`http://[::1]:${port}`);
    await app.close();
  });
  it('should be able to get the IPv4 address', async () => {
    app = testModule.createNestApplication<NestHyperExpressApplication>(
      new HyperExpressAdapter(),
    );
    await appInit(app, port, '127.0.0.5');
    expect(await app.getUrl()).toBe(`http://127.0.0.5:${port}`);
    await app.close();
  });
  it('should return 127.0.0.1 for 0.0.0.0', async () => {
    app = testModule.createNestApplication<NestHyperExpressApplication>(
      new HyperExpressAdapter(),
    );
    await appInit(app, port, '0.0.0.0');
    expect(await app.getUrl()).toBe(`http://127.0.0.1:${port}`);
    await app.close();
  });
  it('should return 127.0.0.1 even in a callback', () => {
    app = testModule.createNestApplication<NestHyperExpressApplication>(
      new HyperExpressAdapter(),
    );
    appInit(app, port, '', async () => {
      expect(await app.getUrl()).toBe(`http://127.0.0.1:${port}`);
      await app.close();
    });
  });
  it('should throw an error for calling getUrl before listen', async () => {
    app = testModule.createNestApplication<NestHyperExpressApplication>(
      new HyperExpressAdapter(),
    );
    try {
      await app.getUrl();
    } catch (err) {
      expect(err).toBe(
        'app.listen() needs to be called before calling app.getUrl()',
      );
    }
  });
});
