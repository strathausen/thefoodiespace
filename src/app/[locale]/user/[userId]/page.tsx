import Image from "next/image";
import { api } from "@/trpc/server";
import { RecipeTile } from "components/recipe/recipt-tile";

export default async function UserPage({
  params,
}: {
  params: { userId: string };
}) {
  const userProfile = await api.profile.viewProfile.query({
    id: params.userId,
  });
  const userRecipes = await api.recipe.userFeed.query({
    userId: params.userId,
  });

  return (
    <main className="m-auto mt-8 max-w-2xl w-full">
        <div className="p-6">
          <h1 className="pb-2 text-center text-2xl font-vollkorn">{userProfile.name}</h1>
          {userProfile.pronouns && (
            <p className="pb-4 text-center text-sm text-stone-700/80">
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
          <p className="m-auto max-w-xs pt-3 text-center">{userProfile.bio}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
            {userRecipes.map((recipe) => (
              <RecipeTile
                key={recipe.id}
                id={recipe.id}
                imageUrl={recipe.images[0]!}
                title={recipe.name}
                profileImageUrl={userProfile.image ?? "/default-profile-image.webp"}
                profileName={userProfile.name!}
                profileId={userProfile.id}
              />))}
              </div>
        </div>
    </main>
  );
}
