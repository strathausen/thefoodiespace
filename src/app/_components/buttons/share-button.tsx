"use client";
import { FaShareNodes } from "react-icons/fa6";

type Props = {
  recipeId: string;
};

export const ShareButton = (props: Props) => {
  return (
    <button
      className="flex items-center gap-1"
      onClick={() =>
        navigator.share({
          title: "tomatovillage recipe",
          url: `${window.location.origin}/recipe/${props.recipeId}`,
        })
      }
    >
      <FaShareNodes className="cursor-pointer hover:scale-125" />
    </button>
  );
};
