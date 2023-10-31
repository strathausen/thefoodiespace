import Link from "next/link";

import { CreatePost } from "@/app/_components/create-post";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { Footer } from "./_components/footer";
import { Feed } from "./_components/feed";
import { NavBar } from "./_components/nav-bar";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background text-text">
      <div className="w-full max-w-3xl">
        <NavBar loggedIn={!!session} />
        <div className="container flex flex-col items-center justify-center gap-12 px-4">
          <div className="mx-5">
            <Feed />
          </div>
          <div className="mb-10">
            <h2 className="text-accent text-xl font-bold">join the waitlist!!</h2>
            <div className="my-4">
              <input className="border border-primary p-2 rounded drop-shadow-hard" type="email" placeholder="enter you're email" />
            </div>
            <button
              className="rounded-sm border border-primary bg-primary/20 px-2 py-0.5 text-primary-darker transition hover:bg-primary/10"
            >sign me up, scotty</button>
          </div>
        </div>
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest.query();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">your most recent post: {latestPost.name}</p>
      ) : (
        <p>you have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
