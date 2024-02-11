"use client";
import { api } from "@/trpc/react";
import { RecipePost } from "components/recipe/recipe-post";
import { useCurrentLocale, useI18n } from "locales/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function MyRecipePage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const page = params.slug?.[0] ?? "feed";
  const explore = page === "explore";
  const search = page === "search";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const t = useI18n();
  const locale = useCurrentLocale();
  const session = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: recipes, isLoading } = api.recipe.feed.useQuery(
    { explore },
    { enabled: !search || searchTerm.length > 3 },
  );

  return (
    <main className="">
      <div className="mt-8 flex justify-center font-vollkorn text-2xl">
        <Link
          className={`rounded-md px-4 py-2 text-gray-800 ${page === "feed" ? "" : "opacity-50"}`}
          href="/feed"
        >
          my feed
        </Link>
        <Link
          className={`rounded-md px-4 py-2 text-gray-800 ${page === "explore" ? "" : "opacity-50"}`}
          href="/feed/explore"
        >
          explore
        </Link>
        <Link
          className={`rounded-md px-4 py-2 text-gray-800 ${page === "search" ? "" : "opacity-50"}`}
          href="/feed/search"
        >
          search
        </Link>
      </div>
      {search && (
        <div className="mt-4 flex justify-center">
          <input
            type="text"
            className="rounded-md bg-transparent backdrop-blur backdrop-brightness-110 bg-white bg-opacity-70 outline-none w-full max-w-md px-2 py-1 text-gray-800 shadow"
            placeholder="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      <div className="mx-auto mt-4">
        {recipes?.map((r) => {
          return (
            <div key={r.id} className="mb-2">
              <div className="m-auto flex justify-center">
                <RecipePost
                  id={r.id}
                  imageUrl={r.images[0]!}
                  title={r.title}
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
