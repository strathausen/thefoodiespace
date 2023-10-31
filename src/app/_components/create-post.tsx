"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/trpc/react";

export function CreatePost() {
  const router = useRouter();
  const [name, setName] = useState("");

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
    },
    onError: (err) => {
      alert(err.message || err);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({ name });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-text border-primary w-full rounded-sm border px-4 py-2 transition focus:border-black/40 focus:outline-none drop-shadow-hard"
      />
      <button
        type="submit"
        className="rounded-sm border-primary border text-primary-darker bg-primary/20 px-6 py-2 transition hover:bg-primary/10"
        disabled={createPost.isLoading}
      >
        {createPost.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
