import { StoryStep } from "interface/event";

interface Props {
  step: StoryStep;
  onVote: (data: { emoji: string; stepOrder: number }) => void;
}

const Step = ({ step, onVote }: Props) => {
  return (
    <div className="flex justify-center">
      {step.emojiContenders.map(({ emoji, vote }) => (
        <div className="flex items-center" key={emoji}>
          <button
            className="btn text-xl"
            onClick={() => onVote({ emoji, stepOrder: step.order })}
          >
            {emoji}
          </button>
          <span>{vote}</span>
        </div>
      ))}
    </div>
  );
};

export default Step;
