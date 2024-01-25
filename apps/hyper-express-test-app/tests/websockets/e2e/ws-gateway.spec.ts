import { HyperExpressWsAdapter } from '@m8a/platform-hyper-express-ws';
import { HyperExpressAdapter, NestHyperExpressApplication } from '@m8a/platform-hyper-express';
import { Test } from '@nestjs/testing';
import * as WebSocket from 'ws';
import { ApplicationGateway } from '../src/app.gateway';
import { CoreGateway } from '../src/core.gateway';
import { ExamplePathGateway } from '../src/example-path.gateway';
import { ServerGateway } from '../src/server.gateway';
import { WsPathGateway } from '../src/ws-path.gateway';
import { WsPathGateway2 } from '../src/ws-path2.gateway';

async function createNestApp(...gateways): Promise<NestHyperExpressApplication> {
  const testingModule = await Test.createTestingModule({
    providers: gateways,
  }).compile();
  const app = testingModule.createNestApplication<NestHyperExpressApplication>(new HyperExpressAdapter());
  app.useWebSocketAdapter(new HyperExpressWsAdapter(app) as any);
  return app;
}

describe('WebSocketGateway (WsAdapter)', () => {
  let ws, ws2, app;

  it(`should handle message (2nd port)`, async () => {
    app = await createNestApp(ApplicationGateway);
    await app.listen(9999);

    ws = new WebSocket('ws://localhost:8080');
    await new Promise(resolve => ws.on('open', resolve));

    ws.send(
      JSON.stringify({
        event: 'push',
        data: {
          test: 'test',
        },
      }),
    );
    await new Promise<void>(resolve =>
      ws.on('message', data => {
        expect(JSON.parse(data).data.test).toEqual('test');
        ws.close();
        resolve();
      }),
    );
  });

  it(`should handle message (http)`, async () => {
    app = await createNestApp(ServerGateway);
    await app.listen(9999);

    ws = new WebSocket('ws://localhost:9999');
    await new Promise(resolve => ws.on('open', resolve));

    ws.send(
      JSON.stringify({
        event: 'push',
        data: {
          test: 'test',
        },
      }),
    );
    await new Promise<void>(resolve =>
      ws.on('message', data => {
        expect(JSON.parse(data).data.test).toEqual('test');
        ws.close();
        resolve();
      }),
    );
  });

  it(`should handle message on a different path`, async () => {
    app = await createNestApp(WsPathGateway);
    await app.listen(3000);
    try {
      ws = new WebSocket('ws://localhost:3000/ws-path');
      await new Promise((resolve, reject) => {
        ws.on('open', resolve);
        ws.on('error', reject);
      });

      ws.send(
        JSON.stringify({
          event: 'push',
          data: {
            test: 'test',
          },
        }),
      );
      await new Promise<void>(resolve =>
        ws.on('message', data => {
          expect(JSON.parse(data).data.test).toEqual('test');
          ws.close();
          resolve();
        }),
      );
    } catch (err) {
      console.log(err);
    }
  });

  it(`should support 2 different gateways running on different paths`, async function () {
    this.retries(10);

    app = await createNestApp(ExamplePathGateway, WsPathGateway2);
    await app.listen(3000);

    // open websockets delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    ws = new WebSocket('ws://localhost:3000/example');
    ws2 = new WebSocket('ws://localhost:3000/ws-path');

    await new Promise<void>(resolve =>
      ws.on('open', () => {
        ws.on('message', data => {
          expect(JSON.parse(data).data.test).toEqual('test');
          ws.close();
          resolve();
        });
        ws.send(
          JSON.stringify({
            event: 'push',
            data: {
              test: 'test',
            },
          }),
        );
      }),
    );

    await new Promise<void>(resolve => {
      ws2.on('message', data => {
        expect(JSON.parse(data).data.test).toEqual('test');
        ws2.close();
        resolve();
      });
      ws2.send(
        JSON.stringify({
          event: 'push',
          data: {
            test: 'test',
          },
        }),
      );
    });
  });

  it(`should support 2 different gateways running on the same path (but different ports)`, async function () {
    this.retries(10);

    app = await createNestApp(ApplicationGateway, CoreGateway);
    await app.listen(3000);

    // open websockets delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    ws = new WebSocket('ws://localhost:8080');
    ws2 = new WebSocket('ws://localhost:8090');

    await new Promise<void>(resolve =>
      ws.on('open', () => {
        ws.on('message', data => {
          expect(JSON.parse(data).data.test).toEqual('test');
          ws.close();
          resolve();
        });
        ws.send(
          JSON.stringify({
            event: 'push',
            data: {
              test: 'test',
            },
          }),
        );
      }),
    );

    await new Promise<void>(resolve => {
      ws2.on('message', data => {
        expect(JSON.parse(data).data.test).toEqual('test');
        ws2.close();
        resolve();
      });
      ws2.send(
        JSON.stringify({
          event: 'push',
          data: {
            test: 'test',
          },
        }),
      );
    });
  });

  it('should let the execution context have a getPattern() method on getClient()', async () => {
    app = await createNestApp(ApplicationGateway);
    await app.listen(3000);

    ws = new WebSocket('ws://localhost:8080');
    await new Promise(resolve => ws.on('open', resolve));

    ws.send(
      JSON.stringify({
        event: 'getClient',
        data: {
          test: 'test',
        },
      }),
    );
    await new Promise<void>(resolve =>
      ws.on('message', data => {
        expect(JSON.parse(data).data.path).toEqual('getClient');
        ws.close();
        resolve();
      }),
    );
  });

  afterEach(async function () {
    await app.close();
  });
});
