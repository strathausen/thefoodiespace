"use client";
import React from "react";
import { useFollowings } from "hooks/useFollowings";
import { FaUserPlus } from "react-icons/fa";
import { FaUserMinus } from "react-icons/fa6";
import { useSession } from "next-auth/react";

type Props = {
  userId: string;
};

export const FollowButton = ({ userId }: Props) => {
  const { ids, follow, unfollow, isFetched } = useFollowings();
  const isFollowing = ids.includes(userId);
  const session = useSession();

  if (session.data?.user?.id === userId) return null;

  return (
    <div className="transition hover:scale-125">
      {isFollowing ? (
        <button
          className="opacity-0 transition hover:opacity-100"
          onClick={async (e) => {
            e.preventDefault();
            await unfollow(userId);
          }}
        >
          <FaUserMinus />
        </button>
      ) : (
        <button
          className={`transition ${!isFetched && "opacity-0"}`}
          onClick={async (e) => {
            e.preventDefault();
            await follow(userId);
          }}
        >
          <FaUserPlus />
        </button>
      )}
    </div>
  );
};
