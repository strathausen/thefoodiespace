import Image from "next/image";

type Props = {
  imageUrl?: string | null;
  size: number;
};

export const ProfileImage = (props: Props) => {
  const { size, imageUrl } = props;
  return (
    <Image
      src={imageUrl ?? "/default-profile-image.webp"}
      width={size}
      height={size}
      alt="profile image"
      className="rounded-full object-cover shadow"
      style={{ width: size, height: size }}
    />
  );
};
