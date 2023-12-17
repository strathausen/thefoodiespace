import type { RecipeStep } from "@/types";
import { FaAngleDown, FaAngleUp, FaTrashAlt } from "react-icons/fa";
import { ImageUpload } from "./image-upload";

type RecipeStepProps = {
  isLast: boolean;
  isFirst: boolean;
  enableDelete: boolean;
  step: RecipeStep;
  number: number;
  onDeleted: () => void;
  onMovedUp: () => void;
  onMovedDown: () => void;
  onChanged: (step: RecipeStep) => void;
};

export const RecipeStepEditor = (props: RecipeStepProps) => {
  return (
    <div>
      <div className="text-stone my-1 flex gap-1">
        <div className="flex-1">step {props.number}</div>
        <button
          disabled={!props.enableDelete}
          className={props.enableDelete ? "" : "opacity-50"}
          onClick={props.onDeleted}
        >
          <FaTrashAlt />
        </button>
        <button
          disabled={props.isFirst}
          className={props.isFirst ? "opacity-50" : ""}
          onClick={props.onMovedUp}
        >
          <FaAngleUp />
        </button>
        <button
          disabled={props.isLast}
          className={props.isLast ? "opacity-50" : ""}
          onClick={props.onMovedDown}
        >
          <FaAngleDown />
        </button>
      </div>
      <div className="flex flex-row gap-2">
        <ImageUpload
          image={props.step.images?.[0]}
          setImage={(image) => {
            props.onChanged({ ...props.step, images: image ? [image] : [] });
          }}
        />
        <div className="flex grow flex-col gap-2">
          <input
            className="w-full rounded px-2 py-1 shadow"
            placeholder="title (optional)"
            value={props.step.name}
            onChange={(e) => {
              props.onChanged({ ...props.step, name: e.target.value });
            }}
          />
          <textarea
            className="h-full w-full rounded px-2 py-1 shadow"
            placeholder="what do you do in this step?"
            value={props.step.text}
            onChange={(e) => {
              props.onChanged({ ...props.step, text: e.target.value });
            }}
          />
          <input
            placeholder="ingredients used"
            className="rounded px-2 py-1 shadow"
            value={props.step.usedIngredients}
            onChange={(e) => {
              props.onChanged({
                ...props.step,
                usedIngredients: e.target.value,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};
