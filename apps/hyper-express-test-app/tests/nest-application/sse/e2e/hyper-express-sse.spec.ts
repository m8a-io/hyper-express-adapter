import { Test } from '@nestjs/testing';
import * as EventSource from 'eventsource';
import { AppModule } from '../src/app.module';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@m8a/platform-hyper-express';
import { appInit } from '../../../utils/app-init';
describe('Sse (Express Application)', () => {
  let app: NestHyperExpressApplication;
  let eventSource: EventSource;

  describe('without forceCloseConnections', () => {
    beforeEach(async () => {
      const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication<NestHyperExpressApplication>(
        new HyperExpressAdapter(),
      );

      await app.listen(3000);
      let url = await app.getUrl();
      console.log('url: ', url);
      url = url
        .replace('0.0.0.0', '127.0.0.1')
        .replace('+unix', '')
        .replace('%3A', ':');
      console.log('url: ', url);
      eventSource = new EventSource(url + '/sse', {
        headers: { connection: 'keep-alive' },
      });
    });

    // The order of actions is very important here. When not using `forceCloseConnections`,
    // the SSe eventsource should close the connections in order to signal the server that
    // the keep-alive connection can be ended.
    afterEach(async () => {
      eventSource.close();

      await app.close();
    });

    it('receives events from server', (done) => {
      eventSource.addEventListener('message', (event) => {
        expect(JSON.parse(event.data)).toEqual({
          hello: 'world',
        });
        done();
      });
    });
  });

  describe('with forceCloseConnections', () => {
    beforeEach(async () => {
      const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication<NestHyperExpressApplication>(
        new HyperExpressAdapter(),
        {
          forceCloseConnections: true,
        },
      );

      await appInit(app);

      let url = await app.getUrl();
      url = url
        .replace('0.0.0.0', '127.0.0.1')
        .replace('+unix', '')
        .replace('%3A', ':');

      eventSource = new EventSource(url + '/sse', {
        headers: { connection: 'keep-alive' },
      });
    });

    afterEach(async () => {
      await app.close();

      eventSource.close();
    });

    it('receives events from server', (done) => {
      eventSource.addEventListener('message', (event) => {
        expect(JSON.parse(event.data)).toEqual({
          hello: 'world',
        });
        done();
      });
    });
  });
});
