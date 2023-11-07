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
import { SchedulerRegistry } from '@nestjs/schedule';

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

  clients: Map<Socket, Map<number, string>> = new Map();

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  handleConnection(client: _Socket) {
    this.clients.set(client, new Map());

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
      const vote = clientVotes.get(stepOrder);

      const step = this.story.steps.find((step) => step.order === stepOrder);

      if (!step) throw new Error('Step not found : ' + stepOrder);

      const contender = step.emojiContenders.find(
        (contender) => contender.emoji === emoji,
      );

      if (!contender) throw new Error('Contender not found : ' + emoji);

      if (!vote) {
        clientVotes.set(stepOrder, emoji);
        contender.vote++;
      }

      if (vote && vote !== emoji) {
        const previousVote = step.emojiContenders.find(
          (contender) => contender.emoji === vote,
        );
        previousVote && previousVote.vote--;

        clientVotes.set(stepOrder, emoji);
        contender.vote++;
      }

      if (vote === emoji) {
        contender.vote--;
        clientVotes.delete(stepOrder);
      }

      this.server.emit('story-update', this.story);
    } catch (error) {
      console.log(error);
      client.emit('user-error', error);
    }
  }

  @SubscribeMessage('start')
  startTimer(
    client: _Socket,
    { stepOrder, timeLeft }: { stepOrder: number; timeLeft: number },
  ) {
    const startDate = new Date();
    const stepTimer = setInterval(() => {
      console.log({ stepOrder, timeLeft });
      let timeleft =
        timeLeft - (new Date().getTime() - startDate.getTime()) / 1000;
      timeleft = Math.round(timeleft);
      if (timeleft < 0) {
        this.schedulerRegistry.deleteInterval(`step-${stepOrder}`);
        return;
      }
      this.server.emit('step-timer', {
        stepOrder,
        timeLeft: timeleft,
      });
    }, 1000);
    this.schedulerRegistry.addInterval(`step-${stepOrder}`, stepTimer);
  }
}
