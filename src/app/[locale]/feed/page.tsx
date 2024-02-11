"use client";
import { api } from "@/trpc/react";
import { RecipePost } from "components/recipe/recipe-post";
import { useCurrentLocale, useI18n } from "locales/client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function MyRecipePage() {
  const [explore, setExplore] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const t = useI18n();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const locale = useCurrentLocale();

  const session = useSession();
  const { data: recipes, isLoading } = api.recipe.feed.useQuery({ explore });

  return (
    <main className="">
        <div className="mt-8 flex justify-center font-vollkorn text-2xl">
          <button
            className={`rounded-md px-4 py-2 text-gray-800 ${explore ? "opacity-50" : ""}`}
            onClick={() => setExplore(false)}
          >
            my feed
          </button>
          <button
            className={`rounded-md px-4 py-2 text-gray-800 ${explore ? "" : "opacity-50"}`}
            onClick={() => setExplore(true)}
          >
            explore
          </button>
        </div>
        <div className="mx-auto mt-4">
          {recipes?.map((r) => {
            return (
              <div key={r.id} className="mb-2">
                <div className="m-auto flex justify-center">
                  <RecipePost
                    id={r.id}
                    imageUrl={r.images[0]!}
                    title={r.name}
                    description={r.text!}
                    profileImageUrl={r.createdBy.image!}
                    profileName={r.createdBy.name!}
                    likeCount={r.likeCount}
                    commentCount={r.commentCount}
                    publishedAt={r.createdAt}
                    profileId={r.createdById}
                    liked={
                      r.reactions.filter((r) => r.type === "LIKE").length > 0
                    }
                    myComments={r.comments}
                    ingredients={r.ingredients}
                    user={session.data?.user}
                    locale={locale}
                  />
                </div>
              </div>
            );
          })}
          {!recipes?.length && (
            <div className="text-center text-2xl font-bold">
              {isLoading ? "loading... 🐌" : "no recipes found"}
            </div>
          )}
        </div>
    </main>
  );
}
