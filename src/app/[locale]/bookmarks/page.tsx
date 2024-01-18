"use client";
import { AuthPage } from "api/auth/auth-page";
import { RecipeTile } from "components/recipe/recipe-tile";
import { useBookmarks } from "hooks/useBookmarks";

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks();
  return (
    <main>
      <AuthPage>
        <div className="my-auto mt-10 max-w-2xl">
          <h1 className="font-vollkorn text-2xl">my bookmarks</h1>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {bookmarks.map(({ recipe }) => (
              <div key={recipe.id}>
                <RecipeTile
                  id={recipe.id}
                  imageUrl={recipe.images[0]!}
                  profileId={recipe.createdBy.id}
                  profileImageUrl={recipe.createdBy.image!}
                  profileName={recipe.createdBy.name!}
                  title={recipe.name}
                />
              </div>
            ))}
          </div>
        </div>
      </AuthPage>
    </main>
  );
}
