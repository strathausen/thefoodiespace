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

  async function onToggleBookmark() {
    setBookmarked(!bookmarked);
    try {
      if (bookmarked) {
        await deleteBookmark.mutateAsync({ recipeId: props.recipeId });
      } else {
        await createBookmark.mutateAsync({ recipeId: props.recipeId });
      }
    } catch (e) {
      setBookmarked(!bookmarked);
    }
  }

  return (
    <button
      className="flex items-center gap-1 transition hover:scale-125"
      onClick={onToggleBookmark}
    >
      {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  );
};
