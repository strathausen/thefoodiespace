import { api } from "@/trpc/server";
import { getServerAuthSession } from "@/server/auth";
import { ServerLoginButton } from "../_components/server-login-button";
import { RecipePost } from "../_components/recipe-post";

export default async function MyRecipePage() {
  const session = await getServerAuthSession();
  if (!session) {
    return <ServerLoginButton />;
  }
  const recipes = await api.recipe.listMine.query({});
  return (
    <main className="max-w-3xl">
      <div className="mt-10 m-auto">
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
                  likeCount={34}
                  commentCount={23}
                  isMine={true}
                  publishedAt={r.createdAt}
                  profileId={session.user.id}
                />
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
