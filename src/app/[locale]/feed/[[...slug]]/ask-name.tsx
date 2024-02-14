"use client";

import { api } from "@/trpc/react";
import { generateDishName } from "@/utils/randomusername";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaShuffle } from "react-icons/fa6";
import { Button } from "ui/button";

export const AskName = () => {
  const session = useSession();
  const [name, setName] = useState(
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    session.data?.user.name || generateDishName(),
  );
  const router = useRouter();
  const updateProfile = api.profile.update.useMutation();

  return (
    <div className="m-auto flex flex-col gap-6">
      <div className="mt-4 text-center font-vollkorn text-3xl font-semibold">
        Hey there! What is your name?
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          className="w-full max-w-md rounded-md bg-transparent bg-white bg-opacity-70 px-2 py-1 text-gray-800 shadow outline-none backdrop-blur backdrop-brightness-110"
          placeholder="your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          onClick={() => {
            setName(generateDishName());
          }}
        >
				<FaShuffle />
        </Button>
        <Button
          onClick={async () => {
            updateProfile.mutate({ name });
            router.push("/feed/explore");
            await session.update();
          }}
          disabled={updateProfile.isLoading || !name.trim()}
        >
          go!
        </Button>
      </div>
    </div>
  );
};
