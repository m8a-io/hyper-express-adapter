import { Test } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../src/app.module';
import {
  getHttpBaseOptions,
  sendCanceledHttpRequest,
  sendHttpRequest,
} from './utils';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';
import { spec } from 'pactum';
import { appInit } from '../../utils/app-init';

const readme = readFileSync(join(process.cwd(), 'README.md'));
const readmeString = readme.toString();

describe('Express FileSend', () => {
  let app: NestHyperExpressApplication;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication(new HyperExpressAdapter());
    await appInit(app);
  });

  it('should return a file from a stream', async () => {
    return await spec()
      .get('/file/stream')
      .expectStatus(200)
      .expectBody(readmeString);
  });
  it('should return a file from a buffer', async () => {
    return spec()
      .get('/file/buffer')
      .expectStatus(200)
      .expectBody(readmeString);
  });
  it('should not stream a non-file', async () => {
    return spec()
      .get('/non-file/pipe-method')
      .expectStatus(200)
      .expectBody({ value: 'Hello world' });
  });
  it('should return a file from an RxJS stream', async () => {
    return spec()
      .get('/file/rxjs/stream')
      .expectStatus(200)
      .expectBody(readmeString);
  });
  it('should return a file with correct headers', async () => {
    return spec()
      .get('/file/with/headers')
      .expectStatus(200)
      .expectHeader('Content-Type', 'text/markdown')
      .expectHeader('Content-Disposition', 'attachment; filename="Readme.md"')
      .expectHeader('Content-Length', readme.byteLength.toString())
      .expectBody(readmeString);
  });
  it('should return an error if the file does not exist', async () => {
    return spec().get('/file/not/exist').expectStatus(400);
  });
  // TODO: temporarily turned off (flaky test)
  it.skip('should allow for the client to end the response and be able to make another', async () => {
    await app.listen(0);
    const url = await getHttpBaseOptions(app);
    await sendCanceledHttpRequest(new URL('/file/slow', url));
    const res = await sendHttpRequest(new URL('/file/stream', url));
    expect(res.statusCode).toEqual(200);
  });

  afterEach(async () => {
    await app.close();
  });
});
