// TODO: need to use hyper-express ws
// import {
//   ConnectedSocket,
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
// } from '@nestjs/websockets';

// @WebSocketGateway(8090)
// export class CoreGateway {
//   @SubscribeMessage('push')
//   onPush(@ConnectedSocket() client, @MessageBody() data) {
//     return {
//       event: 'pop',
//       data,
//     };
//   }
// }
