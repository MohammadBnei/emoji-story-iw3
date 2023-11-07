import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {
  ClientToServerEvent,
  ServerToClientEvent,
  Story,
} from 'interface/event';
import { generateRandomEmojies } from './emoji-list';

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

  story: Story = {
    storyGPT: '',
    steps: [
      {
        emojiContenders: generateRandomEmojies(8).map((emoji) => ({
          emoji,
          vote: 0,
        })),
        order: 1,
        selectedEmoji: '',
      },
    ],
  };

  clients: Map<Socket, { [key: string]: any }> = new Map();

  handleConnection(client: _Socket) {
    this.clients.set(client, {});

    client.emit('story-update', this.story);
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client);
  }
}
