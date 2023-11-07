import { StoryStep } from "interface/event";

interface Props {
  step: StoryStep;
  onVote: (data: { emoji: string; stepOrder: number }) => void;
}

const Step = ({ step, onVote }: Props) => {
  return (
    <>
      <h3 className="text-3xl my-5 text-center font-bold">
        Step : {step.order}
      </h3>
      <div className="flex justify-center flex-col lg:flex-row gap-4">
        {step.emojiContenders.map(({ emoji, vote }) => (
          <button
            key={emoji}
            className="btn text-xl w-28 px-1"
            onClick={() => onVote({ emoji, stepOrder: step.order })}
          >
            <div className="btn-group btn-group-vertical lg:btn-group-horizontal justify-around w-full">
              <div>{emoji}</div>
              <div className="pl-4">{vote}</div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
};

export default Step;
