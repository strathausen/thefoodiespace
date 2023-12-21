import dayjs from "dayjs";
import { api } from "@/trpc/server";
import Link from "next/link";
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
    <main>
      <div className="mt-10">
        {recipes?.map((r) => {
          return (
            <div key={r.id} className="mb-4">
              <Link href={`/editor/${r.id}`} className="m-auto flex">
                <div className="m-auto w-[400px]">
                  <span className="mr-6 text-gray-500">
                    {dayjs(r.createdAt).format("YYYY-MM-DD")}
                  </span>
                  edit
                </div>
              </Link>
              <div className="m-auto flex">
                <RecipePost
                  id={r.id}
                  imageUrl={r.images[0]!}
                  title={r.name || r.id}
                  description={r.text!}
                  profileImageUrl={session.user.image!}
                  profileName={session.user.name!}
                  likeCount={34}
                  commentCount={23}
                />
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
