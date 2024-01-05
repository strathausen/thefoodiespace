"use client";
import { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";

type Props = {
  recipeId: string;
  bookmarked: boolean;
};

// create bookmark, delete bookmark
// create cookbook if needed, or assign to existing or none
export const BookmarkButton = (props: Props) => {
  const [bookmarked, setBookmarked] = useState(props.bookmarked);
  return (
    <button
      className="flex items-center gap-1 transition hover:scale-125"
      onClick={() => setBookmarked(!bookmarked)}
    >
      {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  );
};
