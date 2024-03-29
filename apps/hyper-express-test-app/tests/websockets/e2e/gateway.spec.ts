//TODO: rewrite test for hyper-express, if needed
// import { INestApplication } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import { expect } from 'chai';
// import { io } from 'socket.io-client';
// import { ApplicationGateway } from '../src/app.gateway';
// import { NamespaceGateway } from '../src/namespace.gateway';
// import { ServerGateway } from '../src/server.gateway';

// async function createNestApp(...gateways): Promise<INestApplication> {
//   const testingModule = await Test.createTestingModule({
//     providers: gateways,
//   }).compile();
//   const app = testingModule.createNestApplication();
//   return app;
// }

// describe('WebSocketGateway', () => {
//   let ws, app;

//   it(`should handle message (2nd port)`, async () => {
//     app = await createNestApp(ApplicationGateway);
//     await app.listen(3000);

//     ws = io('http://localhost:8080');
//     ws.emit('push', {
//       test: 'test',
//     });
//     await new Promise<void>(resolve =>
//       ws.on('pop', data => {
//         expect(data.test).to.be.eql('test');
//         resolve();
//       }),
//     );
//   });

//   it(`should handle message (http)`, async () => {
//     app = await createNestApp(ServerGateway);
//     await app.listen(3000);

//     ws = io('http://localhost:3000');
//     ws.emit('push', {
//       test: 'test',
//     });
//     await new Promise<void>(resolve =>
//       ws.on('pop', data => {
//         expect(data.test).to.be.eql('test');
//         resolve();
//       }),
//     );
//   });

//   it(`should handle message (2 gateways)`, async () => {
//     app = await createNestApp(ApplicationGateway, NamespaceGateway);
//     await app.listen(3000);

//     ws = io('http://localhost:8080');
//     io('http://localhost:8080/test').emit('push', {});
//     ws.emit('push', {
//       test: 'test',
//     });
//     await new Promise<void>(resolve =>
//       ws.on('pop', data => {
//         expect(data.test).to.be.eql('test');
//         resolve();
//       }),
//     );
//   });

//   it(`should be able to get the pattern in an interceptor`, async () => {
//     app = await createNestApp(ApplicationGateway);
//     await app.listen(3000);

//     ws = io('http://localhost:8080');
//     ws.emit('getClient', {
//       test: 'test',
//     });
//     await new Promise<void>(resolve =>
//       ws.on('popClient', data => {
//         expect(data.path).to.be.eql('getClient');
//         resolve();
//       }),
//     );
//   });

//   it(`should be able to get the pattern in a filter (when the error comes from a known handler)`, async () => {
//     app = await createNestApp(ApplicationGateway);
//     await app.listen(3000);

//     ws = io('http://localhost:8080');
//     ws.emit('getClientWithError', {
//       test: 'test',
//     });
//     await new Promise<void>(resolve =>
//       ws.on('exception', data => {
//         expect(data.pattern).to.be.eql('getClientWithError');
//         resolve();
//       }),
//     );
//   });

//   afterEach(() => app.close());
// });
