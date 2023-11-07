import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class EmojiGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Socket;

  clients: Map<Socket, { [key: string]: any }> = new Map();

  handleConnection(client: Socket) {
    this.clients.set(client, {});

    client.emit('story-update', {});
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client);
  }
}
