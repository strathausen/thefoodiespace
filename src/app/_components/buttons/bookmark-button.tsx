"use client";
import { api } from "@/trpc/react";
import { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";

type Props = {
  recipeId: string;
  bookmarked: boolean;
};

export const BookmarkButton = (props: Props) => {
  const [bookmarked, setBookmarked] = useState(props.bookmarked);
  const createBookmark = api.bookmark.create.useMutation();
  const deleteBookmark = api.bookmark.remove.useMutation();

  const onToggleBookmark = () => {
    if (bookmarked) {
      deleteBookmark.mutate({ recipeId: props.recipeId });
    } else {
      createBookmark.mutate({ recipeId: props.recipeId });
    }
    setBookmarked(!bookmarked);
  };

  return (
    <button
      className="flex items-center gap-1 transition hover:scale-125"
      onClick={onToggleBookmark}
    >
      {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  );
};
