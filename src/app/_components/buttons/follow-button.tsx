"use client";
import React from "react";
import { useFollowings } from "hooks/useFollowings";
import { FaUserPlus } from "react-icons/fa";
import { FaUserMinus } from "react-icons/fa6";

type Props = {
  userId: string;
};

export const FollowButton = ({ userId }: Props) => {
  const { ids, follow, unfollow, isFetched } = useFollowings();
  const isFollowing = ids.includes(userId);

  return (
    <div className="transition hover:scale-125">
      {isFollowing ? (
        <button
          className="hover:opacity-100 opacity-0 transition"
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
