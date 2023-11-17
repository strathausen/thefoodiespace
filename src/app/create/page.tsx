"use client";
import { on } from "events";
import { useEffect, useState } from "react";

type Ingredient = {
  amount: string;
  unit: string;
  name: string;
  notes?: string;
};

const emptyIngredient: Ingredient = {
  amount: "",
  unit: "",
  name: "",
};

type RecipeStep = {
  title?: string;
  description: string;
  usedIngredients: Ingredient[];
};

const emptyRecipeStep: RecipeStep = {
  description: "",
  usedIngredients: [],
};

const SubHead = ({ children }: { children: React.ReactNode }) => (
  <h4 className="mb-2 text-text underline decoration-accent-alt">{children}</h4>
);

type RecipeInfo = {
  label: string;
  key?: string;
  value: string;
};

// "prep time", "resting time", "baking time", "cooking time", "calories", "portions",
const RecipeInfos: RecipeInfo[] = [
  {
    label: "prep time",
    key: "prepTime",
    value: "",
  },
  {
    label: "resting time",
    key: "restingTime",
    value: "",
  },
  {
    label: "baking time",
    key: "bakingTime",
    value: "",
  },
  {
    label: "cooking time",
    key: "cookingTime",
    value: "",
  },
  {
    label: "calories",
    key: "calories",
    value: "",
  },
  {
    label: "portions",
    key: "portions",
    value: "",
  },
];

export default function RecipePage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([emptyRecipeStep]);

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
      } else {
        setIngredients(newIngredients);
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
          className="flex flex-col gap-6 rounded border border-accent-alt p-4"
        >
          <section>
            <SubHead>info</SubHead>
            <div className="flex flex-row gap-2">
              <div className="block h-[200px] w-[200px] cursor-pointer rounded-sm border border-primary bg-primary/20 text-center text-gray-400">
                add picture
              </div>
              <div className="flex grow flex-col gap-2 py-1">
                <input
                  className="w-full rounded-sm px-2 py-1"
                  placeholder="give it a punchy title"
                />
                <input
                  className="w-full rounded-sm px-2 py-1"
                  placeholder="source url - did this come from somewhere?"
                />
                <textarea
                  className="h-full w-full rounded-sm px-2 py-1"
                  placeholder="tell us about your recipe. use markdown or #hashtags if you want."
                />
              </div>
            </div>
            <div className="mt-4 flex flex-row gap-2 text-center">
              {[
                "prep time",
                "resting time",
                "baking time",
                "cooking time",
                "calories",
                "portions",
              ].map((label, i) => (
                <div key={i} className="rounded-sm border border-primary">
                  <div className="text-sm text-primary">{label}</div>
                  <input className="w-full" />
                </div>
              ))}
            </div>
          </section>
          <section>
            <SubHead>ingredients</SubHead>
            <div className="grid grid-cols-[100px_1fr_1fr_auto] gap-2 text-sm text-primary">
              <div className="px-2">amount</div>
              <div className="px-2">unit</div>
              <div className="px-2">ingredient</div>
              <div className="px-2">notes</div>
            </div>
            {ingredients.map((ingredient, i) => (
              <div
                className="mb-2 mt-1 grid grid-cols-[100px_1fr_1fr_auto] gap-2"
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
          </section>
          <section>
            <SubHead>steps</SubHead>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <div className="block h-[200px] w-[200px] cursor-pointer rounded-sm border border-primary bg-primary/20 text-center text-gray-400">
                  add picture
                </div>
                <div className="flex grow flex-col gap-2">
                  <input
                    className="w-full rounded-sm px-2 py-1"
                    placeholder="title (optional)"
                  />
                  <textarea
                    className="h-full w-full rounded-sm px-2 py-1"
                    placeholder="what do you do in this step?"
                  />
                  <input placeholder="ingredients used" className="px-2 py-1" />
                </div>
              </div>
              <button className="rounded-sm border border-accent-alt bg-accent-alt/20 text-accent-alt">
                add step
              </button>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}
