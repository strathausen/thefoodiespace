"use client";
import { api } from "@/trpc/react";
import type { RecipeStep } from "@/types";
import { useEffect, useState } from "react";
import { RecipeStepEditor } from "components/recipe-step-editor";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/app/_components/image-upload";
import { AuthPage } from "@/app/api/auth/auth-page";

// https://developers.google.com/search/docs/appearance/structured-data/recipe#supply-tool

type Ingredient = {
  quantity: string;
  unit: string;
  name: string;
  notes?: string;
};

const emptyIngredient: Ingredient = {
  quantity: "",
  unit: "",
  name: "",
};

const emptyRecipeStep: RecipeStep = {
  name: "",
  text: "",
  usedIngredients: "",
};

const SubHead = ({ children }: { children: React.ReactNode }) => (
  <h4 className="mb-2 font-bold text-stone-700">{children}</h4>
);

type RecipeInfo = {
  label: string;
  key: string;
  value: string;
};

// "prep time", "resting time", "baking time", "cooking time", "calories", "portions",
/**
 * "prepTime": "PT20M",
 * "cookTime": "PT30M",
 * "totalTime": "PT50M",
 * "keywords": "cake for a party, coffee",
 * "recipeYield": "10",
 * "recipeCategory": "Dessert",
 * "recipeCuisine": "American",
 * "nutrition": {
 *   "@type": "NutritionInformation",
 *   "calories": "270 calories"
 * },
 */
const defaultRecipeInfos: RecipeInfo[] = [
  {
    label: "prep time",
    key: "prepTime",
    value: "",
  },
  {
    label: "cook time",
    key: "cookTime",
    value: "",
  },
  // { // maybe this can be deducted from the other two?
  //   label: "total time",
  //   key: "totalTime",
  //   value: "",
  // },
  {
    label: "calories",
    key: "nutrition.calories",
    value: "",
  },
  // { // try to get this from the ingredients and hashtags
  //   label: "category",
  //   key: "recipeCategory",
  //   value: "",
  // },
  // { // try to get this from the ingredients and hashtags
  //   label: "cuisine",
  //   key: "recipeCuisine",
  //   value: "",
  // },
  {
    label: "portions",
    key: "recipeYield",
    value: "",
  },
  // { // or should these be in-line hashtags?
  //   label: "keywords",
  //   key: "keywords",
  //   value: "",
  // },
];

const inputClassName = "w-full rounded shadow px-2 py-1";

export default function RecipePage({ params }: { params: { id: string[] } }) {
  const id = params.id ? params.id[0] : undefined;
  const [text, setText] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [sourceUrl, setSourceUrl] = useState<string>("");
  const [steps, setSteps] = useState<RecipeStep[]>([{ ...emptyRecipeStep }]);
  const [images, setImages] = useState<string[]>([]);
  const [recipeInfos, setRecipeInfos] =
    useState<RecipeInfo[]>(defaultRecipeInfos);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { ...emptyIngredient },
  ]);

  const router = useRouter();

  const create = api.recipe.upsert.useMutation();
  const get = api.recipe.getMine.useQuery(id!, { enabled: false });

  const saveRecipe = async () => {
    await create.mutateAsync({
      id,
      name,
      text,
      sourceUrl,
      images,
      ingredients: ingredients.filter((i) => i.name),
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      steps: steps.filter((s) => s.name || s.text),
      recipeInfos: recipeInfos.filter((i) => i.value),
    });
    router.refresh();
  };

  useEffect(() => {
    if (id && !get.isFetched && !get.isFetching) {
      console.log("fetching");
      get.refetch().catch((e) => {
        // TODO: handle error
        console.error(e);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (create.isSuccess && !id) {
      router.push(`/editor/${create.data.id}`);
    }
  }, [create.data, create.isSuccess, id, router]);

  useEffect(() => {
    const recipe = get.data;
    if (!get.isSuccess || !recipe) {
      return;
    }
    setName(recipe.name);
    setText(recipe.text ?? "");
    setSourceUrl(recipe.sourceUrl ?? "");
    setImages(recipe.images);
    setIngredients(recipe.ingredients);
    setSteps(recipe.steps as RecipeStep[]); // TODO fix the typing issue here
    setRecipeInfos((infos) => {
      return infos.map((info) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const value = recipe.info[info.key] as string;
        return { ...info, value };
      });
    });
  }, [get.data, get.isSuccess]);

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
      <AuthPage>
        <div className="max-w-xxl my-10">
          <h1 className="py-6 text-xl">recipe editor</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex flex-col gap-6 rounded-md bg-white/40 p-4 shadow-md backdrop-blur-xl"
          >
            <section>
              <SubHead>info</SubHead>
              <div className="flex flex-row gap-2">
                <ImageUpload
                  image={images[0]}
                  setImage={(image) => {
                    if (image) {
                      setImages([image]);
                    } else {
                      setImages([]);
                    }
                  }}
                />
                <div className="flex grow flex-col gap-2">
                  <input
                    className={inputClassName}
                    placeholder="give it a punchy title"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className={inputClassName}
                    placeholder="source url - did this come from somewhere?"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                  />
                  <textarea
                    className="h-full w-full rounded px-2 py-1 shadow"
                    placeholder="tell us about your recipe. use #hashtags if you want."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                {recipeInfos.map((info, i) => (
                  <div key={i}>
                    <label
                      className="text-sm text-stone-500"
                      htmlFor={`info-${i}`}
                    >
                      {info.label}
                    </label>
                    <input
                      id={`info-${i}`}
                      className="w-full rounded px-2 py-1 text-text shadow outline-none"
                      value={info.value}
                      onChange={(e) => {
                        const newRecipeInfos = [...recipeInfos];
                        newRecipeInfos[i]!.value = e.target.value;
                        setRecipeInfos(newRecipeInfos);
                      }}
                    />
                  </div>
                ))}
              </div>
            </section>
            <section>
              <SubHead>ingredients</SubHead>
              <div className="grid grid-cols-[100px_100px_200px_auto] gap-2 text-sm text-stone-500">
                <div className="px-2">amount</div>
                <div className="px-2">unit</div>
                <div className="px-2">ingredient</div>
                <div className="px-2">notes</div>
              </div>
              {ingredients.map((ingredient, i) => (
                <div
                  className="mb-2 mt-1 grid grid-cols-[100px_100px_200px_auto] gap-2"
                  key={i}
                >
                  <input
                    className="rounded px-2 py-1 text-sm shadow"
                    placeholder="1, 1/2, a bit"
                    value={ingredient.quantity}
                    onChange={onChangeIngredient(i, "quantity")}
                  />
                  <input
                    className="rounded px-2 py-1 text-sm shadow"
                    placeholder="scoop, gram, pinch..."
                    value={ingredient.unit}
                    onChange={onChangeIngredient(i, "unit")}
                  />
                  <input
                    className="rounded px-2 py-1 text-sm shadow"
                    placeholder="flour, salt, tomato..."
                    value={ingredient.name}
                    onChange={onChangeIngredient(i, "name")}
                  />
                  <input
                    className="rounded px-2 py-1 text-sm shadow"
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
                {steps.map((step, i) => (
                  <RecipeStepEditor
                    key={i}
                    step={step}
                    number={i + 1}
                    isFirst={i === 0}
                    isLast={i === steps.length - 1}
                    enableDelete={steps.length > 1}
                    onChanged={(step) => {
                      const newSteps = [...steps];
                      newSteps[i] = step;
                      setSteps(newSteps);
                    }}
                    onMovedDown={() => {
                      const newSteps = [...steps];
                      const temp = newSteps[i]!;
                      newSteps[i] = newSteps[i + 1]!;
                      newSteps[i + 1] = temp;
                      setSteps(newSteps);
                    }}
                    onMovedUp={() => {
                      const newSteps = [...steps];
                      const temp = newSteps[i]!;
                      newSteps[i] = newSteps[i - 1]!;
                      newSteps[i - 1] = temp;
                      setSteps(newSteps);
                    }}
                    onDeleted={() => {
                      const newSteps = [...steps];
                      newSteps.splice(i, 1);
                      setSteps(newSteps);
                    }}
                  />
                ))}
                <button
                  className="rounded bg-accent-alt/20 text-accent-alt shadow"
                  onClick={() => {
                    setSteps([...steps, { ...emptyRecipeStep }]);
                  }}
                >
                  + add step
                </button>
              </div>
            </section>
            <div className="text-sm text-red-500">
              {create.error ? `error: ${create.error.message}` : ""}
            </div>
            <div className="flex justify-between">
              <div></div>
              <div className="flex gap-4">
                <button
                  title="not yet implemented"
                  className="cursor-not-allowed rounded bg-red-300/50 px-2 py-1 text-red-800 shadow disabled:opacity-50"
                >
                  archive
                </button>
                <button
                  className="rounded bg-primary/20 px-2 py-1 text-primary shadow disabled:opacity-50"
                  disabled={create.isLoading || !name}
                  onClick={saveRecipe}
                  title={!name ? "name is required" : ""}
                >
                  💾 {id ? "update" : "create"} recipe
                </button>
              </div>
            </div>
          </form>
        </div>
      </AuthPage>
    </main>
  );
}
