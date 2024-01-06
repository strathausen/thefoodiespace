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

  function onLikeClick() {
    if (props.liked) {
      unlike.mutate({ id: props.recipeId });
    } else {
      like.mutate({ id: props.recipeId });
    }
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
