"use client";
import { useBookmarks } from "hooks/useBookmarks";
import { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";

type Props = {
  recipeId: string;
  bookmarked: boolean;
};

export const BookmarkButton = ({ recipeId, ...props }: Props) => {
  const [bookmarked, setBookmarked] = useState(props.bookmarked);
  const { bookmark, unbookmark } = useBookmarks();

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
