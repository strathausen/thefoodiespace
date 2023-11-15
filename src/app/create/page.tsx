"use client";
import { on } from "events";
import { useEffect, useState } from "react";

type Ingredient = {
  amount: string;
  unit: string;
  name: string;
  notes: string;
};

const emptyIngredient: Ingredient = {
  amount: "",
  unit: "",
  name: "",
  notes: "",
};

type RecipeStep = {
  title?: string;
  description: string;
};

export default function RecipePage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    // if the last ingredient is not empty, add a new empty ingredient
    if (!ingredients.length || ingredients[ingredients.length - 1]?.name) {
      setIngredients([...ingredients, { ...emptyIngredient }]);
    } else {
      // if the two last ingredients names are empty, remove the last one
      if (
        ingredients[ingredients.length - 1]?.name === "" &&
        ingredients[ingredients.length - 2]?.name === ""
      ) {
        setIngredients(ingredients.slice(0, ingredients.length - 1));
      }
    }
  }, [ingredients]);

  const onChangeIngredient =
    (i: number, key: keyof Ingredient) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newIngredients = [...ingredients];
      newIngredients[i]![key] = e.target.value;
      // if name is not empty
      if (key === "name") {
        if (e.target.value) {
          // if the last ingredient is not empty, add a new empty ingredient
          setIngredients(newIngredients);
        } else {
          // remove this line
          setIngredients(
            newIngredients.slice(0, i).concat(newIngredients.slice(i + 1)),
          );
        }
      }
    };

  return (
    <main>
      <div className="max-w-xxl mt-10">
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
          <h4 className="text-text underline decoration-accent-alt">
            ingredients
          </h4>
          <div className="mt-4 grid grid-cols-[100px_1fr_1fr_auto] gap-2 text-accent-alt">
            <div className="px-2">amount</div>
            <div className="px-2">unit</div>
            <div className="px-2">ingredient</div>
            <div className="px-2">notes</div>
          </div>
          {ingredients.map((ingredient, i) => (
            <div
              className="mt-1 grid grid-cols-[100px_1fr_1fr_auto] gap-2 pb-1"
              key={i}
            >
              <input
                className="rounded-sm px-2 py-1"
                placeholder="1, 1/2, a bit"
                value={ingredient.amount}
                onChange={onChangeIngredient(i, "amount")}
              />
              <input
                className="rounded-sm px-2 py-1"
                placeholder="scoop, gram, pinch..."
                value={ingredient.unit}
                onChange={onChangeIngredient(i, "unit")}
              />
              <input
                className="rounded-sm px-2 py-1"
                placeholder="flour, salt, tomato..."
                value={ingredient.name}
                onChange={onChangeIngredient(i, "name")}
              />
              <input
                className="rounded-sm px-2 py-1"
                placeholder="to taste, optional..."
                value={ingredient.notes}
                onChange={onChangeIngredient(i, "notes")}
              />
            </div>
          ))}
          {/* steps */}
          <h4 className="mb-4 mt-6 text-text underline decoration-accent-alt">
            steps
          </h4>
          {/* picture on the lest, title and text on the right */}
          <div className="flex flex-row gap-2">
            <div className="block h-[200px] w-[200px] cursor-pointer rounded-sm border-2 bg-amber-50 text-center text-gray-400">
              add picture
            </div>
            <div className="flex grow flex-col gap-2">
              <input className="w-full rounded-sm px-2" placeholder="title" />
              <textarea
                className="h-full w-full rounded-sm px-2"
                placeholder="description"
              />
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
