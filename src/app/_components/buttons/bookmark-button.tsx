"use client";
import { useBookmarks } from "hooks/useBookmarks";
import { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";

type Props = {
  recipeId: string;
};

export const BookmarkButton = ({ recipeId }: Props) => {
  const { bookmark, unbookmark, isBookmarked } = useBookmarks();
  const [bookmarked, setBookmarked] = useState(isBookmarked(recipeId));

  async function onToggleBookmark() {
    setBookmarked(!bookmarked);
    try {
      if (bookmarked) {
        await unbookmark(recipeId);
      } else {
        await bookmark(recipeId);
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
