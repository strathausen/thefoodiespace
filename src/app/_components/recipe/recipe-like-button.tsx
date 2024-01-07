"use client";
import { api } from "@/trpc/react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { PulseCounter } from "ui";

type Props = {
  recipeId: string;
  likeCount: number;
  liked: boolean;
};

export const RecipeLikeButton = (props: Props) => {
  const like = api.recipe.like.useMutation();
  const unlike = api.recipe.unlike.useMutation();

  async function onLikeClick() {
    if (props.liked) {
      await unlike.mutateAsync({ id: props.recipeId });
    } else {
      await like.mutateAsync({ id: props.recipeId });
    }
    // TODO revert state when there has been an error
  }

  return (
    <>
      <PulseCounter
        count={props.likeCount}
        icon={FaRegHeart}
        activeIcon={FaHeart}
        active={props.liked}
        onClick={onLikeClick}
      />
    </>
  );
};
