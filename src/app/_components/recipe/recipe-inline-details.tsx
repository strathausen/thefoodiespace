"use client";
import { useState } from "react";
import { FaKitchenSet, FaX } from "react-icons/fa6";

type Props = {
  recipeId: string;
  ingredients: PrismaJson.RecipeIngredient[];
};

export const RecipeInlineDetails = (props: Props) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div
        className={`absolute bottom-0 top-0 w-full rounded-md bg-white/60 p-4 ${showDetails ? "opacity-100" : "pointer-events-none opacity-0"} backdrop-blur transition`}
      >
        {props.ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex items-center gap-2 drop-shadow-white"
          >
            <p>{ingredient.quantity}</p>
            <p>{ingredient.unit}</p>
            <p className="font-semibold">{ingredient.name}</p>
          </div>
        ))}
      </div>
      <button
        className={`absolute right-0 top-5 rounded-l-xl bg-white/40 pb-3 pl-4 pr-3 pt-3 text-2xl backdrop-blur-xl transition hover:bg-white/70`}
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? <FaX /> : <FaKitchenSet />}
      </button>
    </>
  );
};
