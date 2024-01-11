"use client";
import { useStore } from "hooks/useStore";
import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { FaUserMinus } from "react-icons/fa6";

type Props = {
  userId: string;
};

export const FollowButton = (props: Props) => {
	const store = useStore();
  const [isFollowing, setIsFollowing] = useState(false);

  const follow = () => {
    setIsFollowing(true);
  };

  const unfollow = () => {
    setIsFollowing(false);
  };
  return (
    <div className="transition hover:scale-125">
      {isFollowing ? (
        <button
          className="opacity-0 transition hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            unfollow();
          }}
        >
          <FaUserMinus />
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            follow();
          }}
        >
          <FaUserPlus />
        </button>
      )}
    </div>
  );
};
