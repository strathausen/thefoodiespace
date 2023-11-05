"use client";
import { useState } from "react";

export default function RecipePage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientsText, setIngredientsText] = useState("");

  return (
    <main>
      <div className="mt-10 max-w-xl">
        <h1 className="py-6 text-xl underline decoration-accent">
          create a recipe
        </h1>
        <form
          onSubmit={(e) => {
            // handleSubmit();
            e.preventDefault();
          }}
          className="rounded border border-accent-alt p-4"
        >
          <h3 className="text-lg underline">recipe</h3>
          <p>ingredients</p>
          <div className="flex flex-row bg-white rounded px-3">
            <div className="w-4">
              {ingredients.map((_ingredient, i) => (
                <div key={i} className="flex">•</div>
              ))}
            </div>
            <textarea
              value={ingredientsText}
              className="flex-grow outline-none"
              onChange={(e) => {
                setIngredientsText(e.target.value.replace(/\n\n\n/g, "\n\n"));
                setIngredients(e.target.value.split(/[\n|\r]+/));
              }}
            />
          </div>
        </form>
      </div>
    </main>
  );
}
