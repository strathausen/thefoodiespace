import Image from "next/image";
import { Container } from "./container";
import {
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
  FaRegShareFromSquare,
  FaShareNodes,
} from "react-icons/fa6";

type Props = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  profileImageUrl: string;
  profileName: string;
  likeCount: number;
  commentCount: number;
  onImageClick?: () => void;
  onProfileClick?: () => void;
};

export const RecipePost = (props: Props) => {
  return (
    <div className="m-auto mb-4 mt-4">
      <Container>
        <div className="flex flex-col gap-3 p-2">
          <div className="mt-1 flex w-full flex-row items-center gap-2">
            <Image
              onClick={props.onProfileClick}
              width={48}
              height={48}
              src={props.profileImageUrl}
              alt="profile image"
              className="ml-1 mr-1 h-[42px] w-[42px] rounded-full object-cover shadow-md"
            />
            <div className="flex w-full justify-between">
              <div className="max-w-[320px] ">
                <h2 className="overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold">
                  {props.title}
                </h2>
                <p onClick={props.onProfileClick}>by {props.profileName}</p>
              </div>
              <div className="flex cursor-pointer flex-col gap-0.5 px-2 py-1">
                <div className="h-1 w-1 rounded-full bg-stone-600" />
                <div className="h-1 w-1 rounded-full bg-stone-600" />
                <div className="h-1 w-1 rounded-full bg-stone-600" />
              </div>
            </div>
          </div>
          <Image
            className="h-[400px] w-[400px] rounded-md object-cover"
            height={400}
            width={400}
            alt="description tbd"
            src={props.imageUrl}
            onClick={props.onImageClick}
          />
          <div className="flex flex-col gap-2 px-1">
            <div className="flex flex-row justify-between">
              <div className="flex flex-row justify-end gap-4">
                <div className="flex items-center gap-1 hover:grayscale-0">
                  <FaRegHeart className="cursor-pointer hover:scale-125 hover:grayscale-0" />{" "}
                  {props.likeCount}
                </div>
                <div className="flex items-center gap-1">
                  <FaRegComment className="cursor-pointer hover:scale-125 hover:grayscale-0" />{" "}
                  {props.commentCount}
                </div>
                <div className="flex items-center gap-1">
                  <FaRegShareFromSquare className="cursor-pointer hover:scale-125 hover:grayscale-0" />{" "}
                  {props.commentCount}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <FaShareNodes className="cursor-pointer hover:scale-125 hover:grayscale-0" />{" "}
                </div>
                <div className="flex cursor-pointer items-center gap-1 grayscale transition hover:scale-125">
                  <FaRegBookmark />
                </div>
              </div>
            </div>
            <div>{props.description}</div>
          </div>
          <input
            className="bg-transparent p-1 placeholder:text-green-950/40"
            placeholder="leave a comment..."
          />
        </div>
      </Container>
    </div>
  );
};
