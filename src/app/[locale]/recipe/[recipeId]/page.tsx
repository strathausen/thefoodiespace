import Image from "next/image";
import { api } from "@/trpc/server";
import { Container } from "ui/index";

type Props = {
  params: {
    recipeId: string;
  };
};

export default async function RecipePage(props: Props) {
  const recipe = await api.recipe.get.query(props.params.recipeId);
  if (!recipe) {
    return <div>Recipe not found</div>;
  }
  return (
    <main className="m-auto my-6 max-w-2xl">
      <Container>
        <div className="px-6 py-4">
          <h1 className="font-vollkorn text-3xl font-semibold">
            {recipe.name}
          </h1>
          <div className="mt-6 flex flex-row justify-between gap-4">
            <div className="flex flex-col">{recipe.text}</div>
            <Image
              src={recipe.images[0]!}
              width={300}
              height={300}
              alt={recipe.name}
              className="rounded object-contain"
              style={{ width: 300, height: 300 }}
            />
          </div>
          {/* ingredients */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Ingredients</h2>
            <ul className="mt-3 list-inside list-disc">
              {recipe.ingredients.map((ingredient, i) => (
                <li key={i}>
                  <span>
                    {ingredient.name} ({ingredient.quantity} {ingredient.unit})
                  </span>
                  <span className="text-sm ml-2 text-stone-950/50">{ingredient.notes}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* steps */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Steps</h2>
            <ol className="mt-3 list-inside list-decimal">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  {i + 1}. {step.name}
                  {step.images?.[0] && (
                    <Image
                      src={step.images[0]}
                      width={200}
                      height={200}
                      alt={step.name!}
                      className="rounded object-contain"
                    />
                  )}
                  <p>{step.text}</p>
                  {step.usedIngredients && (
                    <p>used ingredients: {step.usedIngredients}</p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </main>
  );
}
