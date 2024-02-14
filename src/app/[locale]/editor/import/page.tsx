"use client";
import { api } from "@/trpc/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "ui/button";
import Link from "next/link";

export default function RecipePage() {
  const [text, setText] = useState("");
  const router = useRouter();

  const importFromText = api.recipe.importFromText.useMutation();

  return (
    <main>
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col justify-between gap-2">
          <h1 className="mt-6 font-vollkorn text-2xl">
            import recipe from text
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex flex-col gap-6 rounded-md bg-white/40 p-4 shadow-md backdrop-blur-xl"
          >
            {importFromText.error && (
              <div className="text-red-500">{importFromText.error.message}</div>
            )}
            {importFromText.isLoading && (
              <div className="text-primary">
                importing...✨ this could take a while...&apos; please don&apos;t go
                away! 🙏
              </div>
            )}
            <section>
              <div className="flex min-h-72 flex-row gap-2">
                <textarea
                  disabled={importFromText.isLoading}
                  className="h-full min-h-72 w-full rounded px-2 py-1 shadow"
                  placeholder="just copy and paste the recipe here!"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </section>
            <div className="flex justify-between gap-3">
              <Link href="/editor">back to editor</Link>
              <Button
                disabled={importFromText.isLoading}
                onClick={async () => {
                  const res = await importFromText.mutateAsync({ text });
                  router.push(`/editor/${res.id}`);
                }}
              >
                import!
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
