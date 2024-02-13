"use client";
import algoliasearch from "algoliasearch/lite";
import {
  Hits,
  InstantSearch,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch";
import { api } from "@/trpc/react";
import { RecipePost } from "components/recipe/recipe-post";
import { useCurrentLocale, useI18n } from "locales/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { env } from "@/env.mjs";
import { type Recipe } from "@prisma/client";

const searchClient = algoliasearch(
  env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  env.NEXT_PUBLIC_ALGOLIA_READ_API_KEY,
);

const SearchComponent = ({
  locale,
  user,
}: {
  locale: string;
  user: { id: string } | undefined;
}) => {
  const { query, refine } = useSearchBox();
  const { status } = useInstantSearch();

  const [searchTerm, setSearchTerm] = useState(query);
  const Hit = ({
    hit,
  }: {
    hit: Recipe & {
      objectID: string;
      createdBy: { image?: string; name?: string };
    };
  }) => {
    return (
      <div className="m-auto flex justify-center">
        <RecipePost
          id={hit.objectID}
          imageUrl={hit.images[0]!}
          title={hit.title}
          description={hit.text!}
          profileImageUrl={hit.createdBy.image!}
          profileName={hit.createdBy.name!}
          likeCount={hit.likeCount}
          commentCount={hit.commentCount}
          publishedAt={hit.createdAt}
          profileId={hit.createdById}
          liked={false}
          myComments={[]}
          ingredients={hit.ingredients}
          user={user}
          locale={locale}
        />
      </div>
    );
  };
  return (
    <>
      <div className="mt-4 flex justify-center">
        <input
          type="text"
          className="w-full max-w-md rounded-md bg-transparent bg-white bg-opacity-70 px-2 py-1 text-gray-800 shadow outline-none backdrop-blur backdrop-brightness-110"
          placeholder="search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            refine(e.target.value);
          }}
        />
      </div>
      <Hits hitComponent={Hit} />
      {status === "loading" && <div className="text-center">loading...</div>}
    </>
  );
};

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

  const { data: recipes, isLoading } = api.recipe.feed.useQuery(
    { explore },
    { enabled: !search },
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
      <div className="mx-auto mt-4">
        {search ? (
          <InstantSearch searchClient={searchClient} indexName="recipes">
            <SearchComponent locale={locale} user={session.data?.user} />
          </InstantSearch>
        ) : (
          recipes?.map((r) => {
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
          })
        )}
        {!recipes?.length && !search && (
          <div className="text-center text-2xl font-bold">
            {isLoading ? "loading... 🐌" : "no recipes found"}
          </div>
        )}
      </div>
    </main>
  );
}
