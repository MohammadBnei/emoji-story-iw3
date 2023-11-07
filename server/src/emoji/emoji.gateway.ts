import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ClientToServerEvent, ServerToClientEvent } from 'interface/event';

type _Socket = Socket<ClientToServerEvent, ServerToClientEvent>;

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class EmojiGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: _Socket;

  clients: Map<Socket, { [key: string]: any }> = new Map();

  handleConnection(client: _Socket) {
    this.clients.set(client, {});

    client.emit('story-update');
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client);
  }
}
