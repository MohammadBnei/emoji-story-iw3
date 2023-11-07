export interface Story {
  storyGPT: string;
  steps: StoryStep[];
}

export interface StoryStep {
  order: number;
  selectedEmoji: string;
  emojiContenders: EmojiContender[];
}

export interface EmojiContender {
  emoji: string;
  vote: number;
}

export interface ClientToServerEvent {
  "step-vote": (payload: { emoji: string; stepOrder: number }) => void;
  "story-init": (payload: {}) => void;
}

export interface ServerToClientEvent {
  "story-update": (payload: Story) => void;

  "step-timer": (payload: { timeLeft: number; stepOrder: number }) => void;

  "story-error": (payload: Error) => void;
  "user-error": (payload: Error) => void;
}
