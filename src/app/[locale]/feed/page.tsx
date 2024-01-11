import { api } from "@/trpc/server";
import { getServerAuthSession } from "@/server/auth";
import { ServerLoginButton } from "components/server-login-button";
import { RecipePost } from "components/recipe/recipe-post";
import { getCurrentLocale, getI18n } from "locales/server";
import { I18nProviderClient } from "locales/client";

export default async function MyRecipePage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const t = await getI18n();
  const locale = getCurrentLocale();

  const session = await getServerAuthSession();
  if (!session) {
    return <ServerLoginButton />;
  }
  const recipes = await api.recipe.feed.query({});
  return (
    <main className="">
      <I18nProviderClient locale={locale}>
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
                    isMine={r.createdById === session.user.id}
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
      </I18nProviderClient>
    </main>
  );
}
