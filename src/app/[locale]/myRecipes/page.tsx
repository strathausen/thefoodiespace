import { api } from "@/trpc/server";
import { getServerAuthSession } from "@/server/auth";
import { ServerLoginButton } from "components/server-login-button";
import { RecipePost } from "components/recipe-post";
import { getI18n } from "locales/server";

export default async function MyRecipePage() {
  const t = await getI18n();

  const session = await getServerAuthSession();
  if (!session) {
    return <ServerLoginButton />;
  }
  const recipes = await api.recipe.listMine.query({});
  return (
    <main className="">
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
                  profileImageUrl={session.user.image!}
                  profileName={session.user.name!}
                  likeCount={r.likeCount}
                  commentCount={23}
                  isMine={true}
                  publishedAt={r.createdAt}
                  profileId={session.user.id}
                  liked={r.reactions.filter((r) => r.type === "LIKE").length > 0}
                />
              </div>
            </div>
          );
        })}
        {!recipes?.length && (
          <div className="text-center text-2xl font-bold">
            {t("noRecipesYet")}
          </div>
        )}
      </div>
    </main>
  );
}
