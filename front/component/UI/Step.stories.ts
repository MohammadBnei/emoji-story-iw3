import type { Meta, StoryObj } from "@storybook/react";

import Step from "./step";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Emoji-Story/Step",
  component: Step,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof Step>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    step: {
      emojiContenders: [
        {
          emoji: "🎅🏼",
          vote: 0,
        },
        {
          emoji: "🏉",
          vote: 0,
        },
        {
          emoji: "💃🏽",
          vote: 0,
        },
        {
          emoji: "🔆",
          vote: 0,
        },
        {
          emoji: "🍭",
          vote: 0,
        },
        {
          emoji: "🌠",
          vote: 0,
        },
        {
          emoji: "👌🏻",
          vote: 0,
        },
        {
          emoji: "🙎🏼",
          vote: 0,
        },
      ],
      order: 1,
      selectedEmoji: "",
    },
    onVote: () => {},
  },
};
