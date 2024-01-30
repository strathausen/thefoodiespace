import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { RecipePost } from "components/recipe/recipe-post";
import { getCurrentLocale } from "locales/server";

export default async function Home() {
  const feed = await api.recipe.publicFeed.query({});
  const session = await getServerAuthSession();
  const locale = getCurrentLocale();

  return (
    <main>
      <div className="container flex flex-col items-center justify-center gap-3 px-4 mt-5">
        {feed.map((r) => (
          <div key={r.id} className="mx-auto flex justify-center">
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
              liked={false}
              myComments={[]}
              ingredients={r.ingredients}
              user={session?.user}
              locale={locale}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
