import { BookmarkButton } from "components/buttons/bookmark-button";
import Image from "next/image";
import Link from "next/link";
import { FaPen } from "react-icons/fa6";
import { Container } from "ui/container";

type Props = {
  id: string;
  imageUrl: string;
  title: string;
  profileImageUrl: string;
  profileName: string;
  profileId: string;
  showEdit?: boolean;
  published?: boolean;
};

// just a rounded picture, below it the name and profile picture of the user who posted the recipe
// along with the user name
export const RecipeTile = (props: Props) => {
  return (
    <Container>
      <div className="relative flex flex-col gap-3 p-2">
        {(!props.published ?? true) && (
          <div className="pointer-events-none absolute inset-0 z-50 m-auto flex rounded-xl bg-white/60 p-4 font-vollkorn text-2xl font-semibold">
            <div className="m-auto">Unpublished</div>
          </div>
        )}
        <Link href={`/recipe/${props.id}`}>
          <p className="-mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap font-vollkorn text-lg font-semibold text-stone-950/70">
            {props.title}
          </p>
        </Link>
        <div className="group relative">
          <Link href={`/recipe/${props.id}`}>
            {props.imageUrl && (
              <Image
                className="m-auto h-[200px] w-[200px] rounded-md object-cover"
                height={200}
                width={200}
                src={props.imageUrl}
                alt="recipe image"
              />
            )}
          </Link>
          {props.showEdit && (
            <Link
              className="absolute right-0 top-0 hidden rounded-bl rounded-tr bg-white/80 p-2 group-hover:block"
              href={`/editor/${props.id}`}
            >
              <FaPen className="text-primary-darker" />
            </Link>
          )}
        </div>
        <div className="mb-1 flex justify-between">
          <div className="flex items-center gap-2">
            <Link href={`/user/${props.profileId}`}>
              <Image
                width={28}
                height={28}
                src={props.profileImageUrl ?? "/default-profile.webp"}
                alt="profile image"
                className="mx-1 h-[28px] w-[28px] rounded-lg object-cover shadow-md"
              />
            </Link>
            <div className="max-w-[105px]">
              <Link
                href={`/user/${props.profileId}`}
                className="flex items-center gap-2"
              >
                <p>{props.profileName}</p>
              </Link>
            </div>
          </div>
          <BookmarkButton recipeId={props.id} />
        </div>
      </div>
    </Container>
  );
};
