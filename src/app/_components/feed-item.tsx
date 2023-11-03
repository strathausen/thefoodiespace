"use client";
import { useState } from "react";
import type { RecipeFeedItem } from "@/types";
import { FaHeart } from "react-icons/fa";
import { CiBookmarkPlus } from "react-icons/ci";
import { AiOutlineLeftCircle, AiOutlineRightCircle } from "react-icons/ai";
import Link from "next/link";
// import Image from "next/image";

export function FeedItem(props: { item: RecipeFeedItem }) {
  const [imageIdx, setImageIdx] = useState(0);
  const likes = props.item.reactions.find(
    (reaction) => reaction.type === "like",
  );
  return (
    <div className="flex flex-col gap-2 rounded-sm border border-primary bg-white py-2 drop-shadow-hard">
      <Link href={`/recipe/${props.item.id}`}>
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center pl-3">
            <img
              src={props.item.author.avatar}
              alt={props.item.author.name}
              width={30}
              className="rounded-full"
            />
            <div className="px-3">{props.item.author.name}</div>
          </div>
          <div className="px-3 underline decoration-accent">
            {props.item.title}
          </div>
        </div>
      </Link>
      <div className="relative">
        <img
          src={props.item.media[imageIdx]!.url}
          alt={props.item.title}
          width={600}
        />
        <div className="absolute bottom-0 flex w-full justify-center gap-1">
          {/* dots for each image */}
          {props.item.media.map((media, index) => (
            <div
              key={index}
              className={`mb-1 h-3 w-3 cursor-pointer rounded-full ${
                index === imageIdx ? "bg-background/90" : "bg-background/60"
              }`}
              onClick={() => {
                setImageIdx(index);
              }}
            ></div>
          ))}
        </div>
        {!!imageIdx && (
          <div
            className="absolute left-0 top-0 flex h-full cursor-pointer items-center pl-1.5 drop-shadow"
            onClick={() => setImageIdx(imageIdx - 1)}
          >
            <AiOutlineLeftCircle className="text-background/80" size={30} />
          </div>
        )}
        {imageIdx < props.item.media.length - 1 && (
          <div
            className="absolute right-0 top-0 flex h-full cursor-pointer items-center pr-1.5"
            onClick={() => setImageIdx(imageIdx + 1)}
          >
            <AiOutlineRightCircle className="text-background/80" size={30} />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-3">
        <div className="flex items-center text-text">
          {likes?.count ?? 0}&nbsp;
          <FaHeart className="text-primary-dark" />
        </div>
        <div>
          <CiBookmarkPlus />
        </div>
      </div>
    </div>
  );
}
