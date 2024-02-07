import Image from "next/image";

type Props = {
  imageUrl?: string | null;
  size: number;
};

export const ProfileImage = (props: Props) => {
  const { size, imageUrl } = props;
  return (
    <Image
      src={imageUrl ?? "/default-profile.webp"}
      width={size}
      height={size}
      alt="profile image"
      className="rounded-lg object-cover shadow shadow-black/40"
      style={{ width: size, height: size }}
    />
  );
};
