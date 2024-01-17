import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import { api } from "@/trpc/server";
import { Container } from "ui/index";
import { BookmarkButton } from "components/buttons/bookmark-button";
import { RecipeLikeButton } from "components/recipe/recipe-like-button";
import { FollowButton } from "components/buttons/follow-button";
import { RecipeComments } from "components/recipe/recipe-comments";
import { getCurrentLocale } from "locales/server";
import { ServerClientEmbed } from "components/server-client-embed";
import { createRecipeJson } from "@/utils/create-recipe-json";

type Props = {
  params: {
    recipeId: string;
  };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | null> {
  const recipe = await api.recipe.get.query(params.recipeId);
  if (!recipe) {
    return null;
  }
  return {
    title: recipe.name,
    description: recipe.text,
  };
}

export default async function RecipePage(props: Props) {
  const recipe = await api.recipe.get.query(props.params.recipeId);
  const locale = getCurrentLocale();

  if (!recipe) {
    return <div>Recipe not found</div>;
  }
  return (
    <>
      <Script id="recipe-ld-json" type="application/ld+json">
        {JSON.stringify(createRecipeJson(recipe))}
      </Script>
      <main className="m-auto my-6 flex w-full max-w-2xl flex-col">
        <Container>
          <div className="p-6">
            <h1 className="text-center font-vollkorn text-3xl font-semibold">
              {recipe.name}
            </h1>
            <hr className="mb-3 mt-3 border-t-2 border-stone-950" />
            <div className="ml-2 flex flex-row justify-center gap-2">
              <p>by</p>
              <Link href={`/user/${recipe.createdBy.id}`}>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Image
                      width={28}
                      height={28}
                      src={recipe.createdBy.image!}
                      alt="profile image"
                      className="h-[28px] w-[28px] rounded-full object-cover shadow-md"
                    />
                    <div className="max-w-[105px]">
                      <p>{recipe.createdBy.name}</p>
                    </div>
                    <FollowButton userId={recipe.createdBy.id} />
                  </div>
                </div>
              </Link>
            </div>
            <hr className="mb-3 mt-3 border-t-2 border-stone-950" />
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
                      {ingredient.name} ({ingredient.quantity} {ingredient.unit}
                      )
                    </span>
                    <span className="ml-2 text-sm text-stone-950/50">
                      {ingredient.notes}
                    </span>
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
            <hr className="mb-3 mt-3 border-t-2 border-stone-950" />
            <div className="mt-2 flex gap-3">
              <RecipeLikeButton
                recipeId={recipe.id}
                likeCount={recipe.likeCount}
                liked={
                  !!(recipe as unknown as { reactions: [] }).reactions?.filter(
                    (r: { type: string }) => r.type === "LIKE",
                  ).length
                }
              />
              <BookmarkButton recipeId={recipe.id} />
            </div>
            <hr className="mb-3 mt-3 border-t-2 border-stone-950" />
            <div className="flex flex-col items-center">
              <div className="font-vollkorn text-xl">comments</div>
              {recipe.comments && (
                <ServerClientEmbed locale={locale}>
                  <RecipeComments
                    commentCount={recipe.commentCount}
                    recipeId={recipe.id}
                    comments={recipe.comments}
                  />
                </ServerClientEmbed>
              )}
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
