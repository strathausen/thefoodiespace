"use client";
import { FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa6";
import { PulseCounter } from "ui";

type Props = {
  likeCount: number;
  commentCount: number;
  shareCount?: number; // not in mvp
};

export const RecipeActions = (props: Props) => {
  return (
    <>
      <PulseCounter
        count={props.likeCount}
        icon={FaRegHeart}
        activeIcon={FaHeart}
        active={true}
        onClick={() => {
          console.log("like");
        }}
      />
      <PulseCounter count={props.commentCount * 1234} icon={FaRegComment} />
      {/* <PulseCounter count={13000000} icon={FaRegShareFromSquare} /> */}
    </>
  );
};
