"use client";
import { AuthPage } from "api/auth/auth-page";
import { useBookmarks } from "hooks/useBookmarks";
import { Container } from "ui/container";

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks();
  return (
    <main>
      <AuthPage>
        <div className="mx-auto mt-10 max-w-xl">
          <Container>
            <div className="p-4">
              <h1 className="font-vollkorn text-2xl">my bookmarks</h1>
              {bookmarks.map(({ recipe }) => (
                <div key={recipe.id}>
                  <p>{recipe.name}</p>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </AuthPage>
    </main>
  );
}
