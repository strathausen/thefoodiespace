import Image from "next/image";
import { api } from "@/trpc/server";
import { RecipeTile } from "components/recipe/recipt-tile";
import { notFound } from "next/navigation";
import { FaPen } from "react-icons/fa6";
import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";

export default async function UserPage({
  params,
}: {
  params: { userId: string; handle: string; locale: string };
}) {
  const session = await getServerAuthSession();
  // if handle doesn't start with @ or ~, don't show the page
  if (params.handle && !params.handle.startsWith("~")) {
    notFound();
  }
  const userProfile = await api.profile.viewProfile.query(
    params.handle
      ? {
          handle: params.handle.replace(/[@~]/, ""),
        }
      : {
          id: params.userId,
        },
  );
  if (!userProfile) {
    notFound();
  }
  const userRecipes = await api.recipe.userFeed.query({
    userId: userProfile.id,
  });

  return (
    <main className="m-auto mt-8 w-full max-w-2xl">
      <div className="relative flex flex-col gap-3 p-6">
        {session?.user?.id === userProfile.id && (
          <Link
            href="/profile"
            className="absolute right-0 top-0 flex items-center gap-2"
          >
            <FaPen /> edit profile
          </Link>
        )}
        <h1 className="text-center font-vollkorn text-2xl">
          {userProfile.name}
        </h1>
        {userProfile.pronouns && (
          <p className="text-center text-sm text-stone-700/80">
            {userProfile.pronouns}
          </p>
        )}
        {userProfile.image && (
          <div className="flex justify-center">
            <Image
              className="rounded-full object-cover"
              src={userProfile.image ?? "/default-profile-image.webp"}
              alt={userProfile.name!}
              width={200}
              height={200}
              style={{ width: 200, height: 200 }}
            />
          </div>
        )}
        <div>
          {userProfile.links.map((link) => {
            // if link doesn't have http or https, add https
            const url = !link.match(/^https?:\/\//) ? "https://" + link : link;
            return (
              <div key={link} className="flex justify-center">
                <a className="text-center text-sm text-stone-700/80" href={url}>
                  {link}
                </a>
              </div>
            );
          })}
        </div>
        <p className="m-auto max-w-xs text-center">{userProfile.bio}</p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {userRecipes.map((recipe) => (
            <RecipeTile
              key={recipe.id}
              id={recipe.id}
              imageUrl={recipe.images[0]!}
              title={recipe.name}
              profileImageUrl={
                userProfile.image ?? "/default-profile-image.webp"
              }
              profileName={userProfile.name!}
              profileId={userProfile.id}
              showEdit={true}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
