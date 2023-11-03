"use client";

import { api } from "@/trpc/react";
import { useState } from "react";

export const WaitlistForm = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const add = api.waitlist.add.useMutation();

  const handleSubmit = () => {
    add.mutate({ email });
    setSent(true);
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-accent">join the waitlist!!</h2>
      {sent ? (
        <p className="text-primary-darker">thanks for signing up!</p>
      ) : (
        <>
          <div className="my-4">
            <input
              className="rounded border border-primary p-2 drop-shadow-hard"
              type="email"
              placeholder="enter you're email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            className="rounded-sm border border-primary bg-primary/20 px-2 py-0.5 text-primary-darker transition hover:bg-primary/10"
            onClick={handleSubmit}
          >
            sign me up, scotty
          </button>
        </>
      )}
    </div>
  );
};
