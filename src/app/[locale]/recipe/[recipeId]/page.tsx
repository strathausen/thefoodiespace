import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { api } from "@/trpc/server";
import { Container } from "ui/index";
import { BookmarkButton } from "components/buttons/bookmark-button";
import { RecipeLikeButton } from "components/recipe/recipe-like-button";
import { FollowButton } from "components/buttons/follow-button";
import { RecipeComments } from "components/recipe/recipe-comments";
import { getCurrentLocale } from "locales/server";
import {
  ServerClientEmbed,
  ServerClientEmbedPrompt,
} from "components/server-client-embed";
import { createRecipeJson } from "@/utils/create-recipe-json";
import { Heading } from "components/typography/Heading2";
import { RecipeIngredients } from "components/recipe/recipe-ingredients";
import { getServerAuthSession } from "@/server/auth";
import { FaPen, FaRegBookmark } from "react-icons/fa6";

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
  const session = await getServerAuthSession();
  const locale = getCurrentLocale();

  if (!recipe) {
    return <div>Recipe not found 😿</div>;
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createRecipeJson(recipe)),
        }}
      />
      <main className="m-auto my-6 flex w-full max-w-2xl flex-col">
        <Container>
          <div className="relative p-6">
            <h1 className="text-center font-vollkorn text-3xl font-semibold">
              {recipe.name}
            </h1>
            {recipe.createdById === session?.user?.id && (
              <Link
                href={`/editor/${recipe.id}`}
                className="absolute right-3 top-3 flex items-center gap-2"
              >
                <FaPen /> edit recipe
              </Link>
            )}
            <hr className="mb-3 mt-3 border-t-2 border-stone-950" />
            <div className="flex flex-row justify-center gap-2">
              <p>by</p>
              <Link href={`/user/${recipe.createdBy.id}`}>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Image
                      width={28}
                      height={28}
                      src={recipe.createdBy.image ?? "/default-profile.webp"}
                      alt="profile image"
                      className="h-[28px] w-[28px] rounded-lg object-cover shadow-md"
                    />
                    <div>
                      <p>{recipe.createdBy.name}</p>
                    </div>
                    {session?.user &&
                      session.user.id !== recipe.createdById && (
                        <ServerClientEmbed locale={locale}>
                          <FollowButton userId={recipe.createdBy.id} />
                        </ServerClientEmbed>
                      )}
                  </div>
                </div>
              </Link>
            </div>
            <hr className="mb-3 mt-3 border-t-2 border-stone-950" />
            <div
              className={`mt-6 flex flex-row ${recipe.text?.trim() ? "justify-between" : "justify-center"} gap-4`}
            >
              <div className="flex flex-col">{recipe.text}</div>
              {recipe.images?.[0] && (
                <Image
                  src={recipe.images[0]}
                  width={300}
                  height={300}
                  alt={recipe.name}
                  className="rounded object-cover"
                  style={{ width: 300, height: 300 }}
                />
              )}
            </div>
            {recipe.ingredients.length > 0 && (
              <RecipeIngredients
                ingredients={recipe.ingredients}
                className="mt-6"
                yield={recipe.info?.recipeYield}
              />
            )}
            {/* steps */}
            {recipe.steps.length > 0 && (
              <div className="mt-6">
                <Heading
                  id="steps"
                  className="font-vollkorn text-xl font-semibold"
                >
                  steps
                </Heading>
                <ol className="mt-3 list-inside list-decimal">
                  {recipe.steps.map((step, i) => (
                    <li key={i} className="mb-5 mt-5 flex flex-col gap-2">
                      <h3 className="font-vollkorn text-lg font-semibold">
                        Step {i + 1}. {step.name}
                      </h3>
                      <div className="flex gap-4">
                        {step.images?.[0] && (
                          <Image
                            src={step.images[0]}
                            width={200}
                            height={200}
                            alt={step.name!}
                            className="h-[200px] w-[200px] rounded object-cover"
                          />
                        )}
                        <p>{step.text}</p>
                      </div>
                      {step.usedIngredients && (
                        <p className="text-stone-950/50">
                          used ingredients: {step.usedIngredients}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <hr className="mb-3 mt-3 border-t-2 border-stone-950" />
            <div className="mt-2 flex items-center justify-center gap-3">
              <RecipeLikeButton
                recipeId={recipe.id}
                likeCount={recipe.likeCount}
                liked={
                  !!(recipe as unknown as { reactions: [] }).reactions?.filter(
                    (r: { type: string }) => r.type === "LIKE",
                  ).length
                }
              />
              {session?.user ? (
                <BookmarkButton recipeId={recipe.id} />
              ) : (
                <FaRegBookmark title="sign in to bookmark" />
              )}
            </div>
            <hr className="mb-3 mt-3 border-t-2 border-stone-950" />
            <div className="flex flex-col items-center">
              <Heading
                id="comments"
                className="font-vollkorn text-xl font-semibold"
              >
                comments
              </Heading>
              {recipe.comments && (
                <ServerClientEmbedPrompt locale={locale}>
                  <RecipeComments
                    commentCount={recipe.commentCount}
                    recipeId={recipe.id}
                    comments={recipe.comments}
                  />
                </ServerClientEmbedPrompt>
              )}
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
