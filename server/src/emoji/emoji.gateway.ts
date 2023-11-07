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

  clients: Map<Socket, { emoji: string; stepOrder: number }[]> = new Map();

  handleConnection(client: _Socket) {
    this.clients.set(client, []);

    client.emit('story-update', this.story);
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client);
  }

  @SubscribeMessage('step-vote')
  onStepVote(client: _Socket, data: { emoji: string; stepOrder: number }) {
    try {
      const { emoji, stepOrder } = data;
      const clientVotes = this.clients.get(client);
      const vote = clientVotes.find((vote) => vote.stepOrder === stepOrder);

      const step = this.story.steps.find((step) => step.order === stepOrder);

      if (!step) throw new Error('Step not found : ' + stepOrder);

      const contender = step.emojiContenders.find(
        (contender) => contender.emoji === emoji,
      );

      if (!contender) throw new Error('Contender not found : ' + emoji);

      if (!vote) {
        clientVotes.push({ emoji, stepOrder });

        contender.vote++;
        this.server.emit('story-update', this.story);
        return;
      }

      if (vote.emoji === emoji) {
        contender.vote--;
        vote.emoji = '';
        this.server.emit('story-update', this.story);
        return;
      } else {
        const previousVote = step.emojiContenders.find(
          (contender) => contender.emoji === vote.emoji,
        );

        if (previousVote) previousVote.vote--;

        vote.emoji = emoji;
      }

      contender.vote++;

      this.server.emit('story-update', this.story);
    } catch (error) {
      client.emit('user-error', error);
    }
  }
}
