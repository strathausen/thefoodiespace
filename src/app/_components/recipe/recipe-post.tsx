import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { truncate } from "lodash";
import { Container } from "ui";
import { RecipePostDropdown } from "components/recipe/recipe-post-dropdown";
import { RecipeLikeButton } from "components/recipe/recipe-like-button";
import { BookmarkButton } from "components/buttons/bookmark-button";
import { RecipeComments } from "./recipe-comments";
import { FollowButton } from "components/buttons/follow-button";
import { RecipeInlineDetails } from "./recipe-inline-details";

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
  liked: boolean;
  publishedAt: Date;
  myComments: { text: string; id: string; createdAt: Date }[];
  ingredients: PrismaJson.RecipeIngredient[];
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
            <RecipeInlineDetails
              recipeId={props.id}
              ingredients={props.ingredients}
            />
          </div>
          <div className="flex flex-col gap-2 px-1">
            <div className="flex flex-row justify-between">
              <div className="flex flex-row justify-end gap-3">
                <RecipeLikeButton
                  recipeId={props.id}
                  likeCount={props.likeCount}
                  liked={props.liked}
                />
                <div className="max-w-[330px] overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold">
                  {props.title}
                </div>
              </div>
              <div className="flex gap-2">
                <BookmarkButton recipeId={props.id} />
              </div>
            </div>
            <Link href={`/recipe/${props.id}`}>
              <div className="max-w-[392px]">
                {truncate(props.description, { length: 186 })}{" "}
              </div>
            </Link>
          </div>
          <RecipeComments
            recipeId={props.id}
            comments={props.myComments}
            commentCount={props.commentCount}
          />
        </div>
      </Container>
    </div>
  );
};
