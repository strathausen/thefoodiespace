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
import { type Session } from "next-auth";
import {
  ServerClientEmbed,
  ServerClientEmbedPrompt,
} from "components/server-client-embed";

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
  user?: Session["user"];
  locale: string;
};

export const RecipePost = (props: Props) => {
  return (
    <div className="m-auto mb-4 mt-4">
      <Container>
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center gap-2">
            <Link href={`/user/${props.profileId}`}>
              <Image
                width={42}
                height={40}
                src={props.profileImageUrl ?? "/default-profile-image.webp"}
                alt="profile image"
                className="h-[40px] w-[42px] rounded-lg object-cover object-center"
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
                    <ServerClientEmbed locale={props.locale}>
                      <FollowButton userId={props.profileId} />
                    </ServerClientEmbed>
                  </div>
                </Link>
                <p className="text-xs text-green-950/60">
                  {dayjs(props.publishedAt).format("D MMM YYYY")}
                </p>
              </div>
              <ServerClientEmbed locale={props.locale}>
                <RecipePostDropdown
                  recipeId={props.id}
                  profileId={props.profileId}
                />
              </ServerClientEmbed>
            </div>
          </div>
          <div className="relative">
            <Link href={`/recipe/${props.id}`}>
              <Image
                className="h-[400px] w-[400px] rounded-md object-cover object-center"
                height={400}
                width={400}
                alt="description tbd"
                src={props.imageUrl}
              />
            </Link>
            {!!props.ingredients.length && (
              <RecipeInlineDetails
                recipeId={props.id}
                ingredients={props.ingredients}
              />
            )}
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
          {props.user && (
            <ServerClientEmbedPrompt locale={props.locale}>
              <RecipeComments
                recipeId={props.id}
                comments={props.myComments}
                commentCount={props.commentCount}
              />
            </ServerClientEmbedPrompt>
          )}
        </div>
      </Container>
    </div>
  );
};
