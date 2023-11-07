import { Module } from '@nestjs/common';
import { EmojiGateway } from './emoji/emoji.gateway';
import { EmojiModule } from './emoji/emoji.module';

@Module({
  imports: [EmojiModule],
  controllers: [],
  providers: [EmojiGateway],
})
export class AppModule {}
