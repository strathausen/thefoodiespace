import Image from "next/image";
import Link from "next/link";
import { api } from "@/trpc/server";
import { Container } from "ui/index";
import { BookmarkButton } from "components/buttons/bookmark-button";
import { RecipeLikeButton } from "components/recipe/recipe-like-button";
import { FollowButton } from "components/buttons/follow-button";
import { RecipeComments } from "components/recipe/recipe-comments";
import { I18nProviderClient } from "locales/client";
import { getCurrentLocale } from "locales/server";
import { SessionProvider } from "next-auth/react";
import { ServerClientEmbed } from "components/server-client-embed";

type Props = {
  params: {
    recipeId: string;
  };
};

export default async function RecipePage(props: Props) {
  const recipe = await api.recipe.get.query(props.params.recipeId);
  const locale = getCurrentLocale();

  if (!recipe) {
    return <div>Recipe not found</div>;
  }
  return (
    <main className="m-auto my-6 flex w-full max-w-2xl flex-col">
      <Container>
        <div className="px-6 py-4">
          <h1 className="text-center font-vollkorn text-3xl font-semibold">
            {recipe.name}
          </h1>
          <hr className="mb-3 mt-3 border-t-2 border-stone-950" />
          {/* profile */}
          <div className="flex flex-row justify-between gap-4">
            <Link href={`/user/${recipe.createdBy.id}`}>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Image
                    width={28}
                    height={28}
                    src={recipe.createdBy.image!}
                    alt="profile image"
                    className="mx-1 h-[28px] w-[28px] rounded-full object-cover shadow-md"
                  />
                  <div className="max-w-[105px]">
                    <p>{recipe.createdBy.name}</p>
                  </div>
                  <FollowButton userId={recipe.createdBy.id} />
                </div>
              </div>
            </Link>
            <div className="flex flex-col">
              <p className="text-sm text-stone-950/50">
                {new Date(recipe.createdAt).toLocaleDateString()}
              </p>
            </div>
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
                    {ingredient.name} ({ingredient.quantity} {ingredient.unit})
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
          <div>
            <div>comments:</div>
            {recipe.commentCount && (
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
  );
}
