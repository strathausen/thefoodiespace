"use client";
import { api } from "@/trpc/react";
import { AuthPage } from "api/auth/auth-page";
import { RecipePost } from "components/recipe/recipe-post";
import { useCurrentLocale, useI18n } from "locales/client";
// import { useSession } from "next-auth/react";

export default function MyRecipePage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const t = useI18n();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const locale = useCurrentLocale();

  // const session = useSession();
  const { data: recipes } = api.recipe.feed.useQuery({});
  return (
    <main className="">
      <AuthPage>
        <div className="m-auto mt-10">
          {recipes?.map((r) => {
            return (
              <div key={r.id} className="mb-2">
                <div className="m-auto flex justify-center">
                  <RecipePost
                    id={r.id}
                    imageUrl={r.images[0]!}
                    title={r.name || r.id}
                    description={r.text!}
                    profileImageUrl={r.createdBy.image!}
                    profileName={r.createdBy.name!}
                    likeCount={r.likeCount}
                    commentCount={r.commentCount} // is not yet implemented
                    // isMine={r.createdById === session.data?.user.id}
                    isMine={false}
                    publishedAt={r.createdAt}
                    profileId={r.createdById}
                    liked={
                      r.reactions.filter((r) => r.type === "LIKE").length > 0
                    }
                    bookmarked={r.bookmarks.length > 0}
                    myComments={r.comments}
                  />
                </div>
              </div>
            );
          })}
          {!recipes?.length && (
            <div className="text-center text-2xl font-bold">
              no recipes found
            </div>
          )}
        </div>
      </AuthPage>
    </main>
  );
}
