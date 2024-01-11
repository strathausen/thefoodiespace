import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { truncate } from "lodash";
import { Container } from "ui";
import { FaKitchenSet } from "react-icons/fa6";
import { RecipePostDropdown } from "components/recipe/recipe-post-dropdown";
import { RecipeLikeButton } from "components/recipe/recipe-like-button";
import { BookmarkButton } from "components/buttons/bookmark-button";
import { RecipeCommentField } from "./recipe-comment-field";
import { FollowButton } from "components/buttons/follow-button";

type Props = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  profileImageUrl: string;
  profileName: string;
  profileId: string;
  likeCount: number;
  commentCount: number;
  isMine?: boolean; // ignored
  liked: boolean;
  bookmarked: boolean;
  publishedAt: Date;
  myComments: { text: string; id: string; createdAt: Date }[];
};

export const RecipePost = (props: Props) => {
  return (
    <div className="m-auto mb-4 mt-4">
      <Container>
        <div className="flex flex-col gap-3 p-2">
          <div className="mt-1 flex items-center gap-2">
            <Link href={`/user/${props.profileId}`}>
              <Image
                width={38}
                height={38}
                src={props.profileImageUrl}
                alt="profile image"
                className="mx-1 h-[38px] w-[38px] rounded-full object-cover shadow-md"
              />
            </Link>
            <div className="flex w-full justify-between">
              <div className="max-w-[305px] ">
                <Link
                  href={`/user/${props.profileId}`}
                  className="flex items-center gap-2"
                >
                  <p>{props.profileName}</p>
                  <div className="text-sm text-green-950/50">
                    <FollowButton userId={props.profileId} />
                  </div>
                </Link>
                <p className="text-xs text-green-950/60">
                  {dayjs(props.publishedAt).format("D MMM YYYY")}
                </p>
              </div>
              <RecipePostDropdown
                recipeId={props.id}
                profileId={props.profileId}
              />
            </div>
          </div>
          <div className="relative">
            <Link href={`/recipe/${props.id}`}>
              <Image
                className="h-[400px] w-[400px] rounded-md object-cover"
                height={400}
                width={400}
                alt="description tbd"
                src={props.imageUrl}
              />
            </Link>
            <button className="absolute bottom-5 right-0 rounded-l-xl bg-white/40 pb-3 pl-4 pr-3 pt-3 text-2xl backdrop-blur-md transition hover:bg-white/70">
              <FaKitchenSet />
            </button>
          </div>
          <div className="flex flex-col gap-2 px-1">
            <div className="flex flex-row justify-between">
              <div className="flex flex-row justify-end gap-4">
                <RecipeLikeButton
                  recipeId={props.id}
                  likeCount={props.likeCount}
                  liked={props.liked}
                />
              </div>
              <div className="flex gap-2">
                <BookmarkButton
                  recipeId={props.id}
                />
              </div>
            </div>
            <Link href={`/recipe/${props.id}`}>
              <div className="max-w-[392px]">
                {truncate(props.description, { length: 186 })}{" "}
                {/* <span className="text-sm text-slate-700">
                  read&nbsp;more -&gt;
                </span> */}
              </div>
            </Link>
          </div>
          <RecipeCommentField
            recipeId={props.id}
            myComments={props.myComments}
          />
        </div>
      </Container>
    </div>
  );
};
