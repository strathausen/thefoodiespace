"use client";
import { api } from "@/trpc/react";
import type { RecipeStep } from "@/types";
import { useEffect, useState } from "react";
import { RecipeStepEditor } from "components/recipe/recipe-step-editor";
import { useRouter } from "next/navigation";
import { ImageUpload } from "components/image-upload";
import { useScopedI18n } from "locales/client";
import Link from "next/link";

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
  key: keyof PrismaJson.RecipeInfos;
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
  const [title, setTitle] = useState<string>("");
  const [sourceUrl, setSourceUrl] = useState<string>("");
  const [steps, setSteps] = useState<RecipeStep[]>([{ ...emptyRecipeStep }]);
  const [images, setImages] = useState<string[]>([]);
  const [recipeInfos, setRecipeInfos] =
    useState<RecipeInfo[]>(defaultRecipeInfos);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { ...emptyIngredient },
  ]);
  const publishMutation = api.recipe.publish.useMutation();
  const unpublishMutation = api.recipe.unpublish.useMutation();
  const t = useScopedI18n("editor");

  const router = useRouter();

  const create = api.recipe.upsert.useMutation();
  const get = api.recipe.getMine.useQuery(id!, { enabled: false });

  const saveRecipe = async () => {
    await create.mutateAsync({
      id,
      title: title || "untitled",
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
    setTitle(recipe.title);
    setText(recipe.text ?? "");
    setSourceUrl(recipe.sourceUrl ?? "");
    setImages(recipe.images);
    setIngredients(recipe.ingredients);
    setSteps(recipe.steps as RecipeStep[]); // TODO fix the typing issue here
    setRecipeInfos((infos) => {
      return infos.map((info) => {
        const value = recipe.info[info.key]!;
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

  const onPublish = async () => {
    if (!id) return;
    await publishMutation.mutateAsync({ id });
    await get.refetch();
    router.refresh();
  };
  const onUnpublish = async () => {
    if (!id) return;
    await unpublishMutation.mutateAsync({ id });
    await get.refetch();
    router.refresh();
  };

  const ActionBar = () => {
    const className =
      "rounded bg-primary/20 px-2 py-1 text-primary shadow disabled:opacity-50";
    return (
      <div className="m-4 flex justify-between">
        <div className="flex gap-4">
          {id && (
            <Link className={className} href={`/recipe/${id}`}>
              view
            </Link>
          )}
        </div>
        <div className="flex gap-4">
          {!id && (
            <Link className={className} href="/editor/import">
              create from text
            </Link>
          )}
          {get.data?.status === "DRAFT" && (
            <button
              className={className}
              onClick={onPublish}
              disabled={publishMutation.isLoading || !title || !images.length}
              title={
                !title
                  ? "title is required"
                  : !images.length
                    ? "image is required"
                    : ""
              }
            >
              {publishMutation.isLoading ? "publishing..." : "publish"}
            </button>
          )}
          {get.data?.status === "PUBLISHED" && (
            <button className={className} onClick={onUnpublish}>
              unpublish
            </button>
          )}
          <button
            className={className}
            disabled={create.isLoading}
            onClick={saveRecipe}
          >
            💾 {id ? "update" : "create"} recipe
          </button>
        </div>
      </div>
    );
  };

  return (
    <main>
      <div className="mx-auto max-w-3xl">
        <div>
          <h1 className="mt-6 font-vollkorn text-2xl">{t("title")}</h1>
          <ActionBar />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex flex-col gap-6 rounded-md bg-white/40 p-4 shadow-md backdrop-blur-xl"
        >
          <section>
            <div className="flex flex-row gap-2">
              <ImageUpload
                image={images[0]}
                required
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
                  className={
                    inputClassName +
                    (!title ? " m-[-1px] border border-red-500" : "")
                  }
                  required
                  placeholder="give it a punchy title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
        </form>
        <ActionBar />
      </div>
    </main>
  );
}
