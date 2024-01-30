"use client";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";

const size = 240;

type Props = {
  image: string | undefined;
  setImage: (image: string | undefined) => void;
  size?: number;
  onUploadError?: (error: Error) => void;
};

export const ImageUpload = ({ image, setImage, onUploadError }: Props) => {
  return (
    <div className="h-[240px] w-[240px] rounded bg-white/30 shadow">
      <div className="absolute mb-2 flex justify-center">
        {image && (
          <Image
            src={image}
            width={size}
            height={size}
            className="h-[240px] w-[240px] rounded object-cover"
            alt="food pic"
          />
        )}
      </div>
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res) {
            setImage(res[0]?.url);
          }
        }}
        onUploadError={onUploadError}
        // appearance={{
        //   label:
        //     "bg-white/40 text-3xl border-primary rounded-lg h-[50px] w-[50px] hover:bg-white/80",
        //   container: "border-none",
        // }}
        // content={{ button: "upload photo", label: "📷" }}
      />
    </div>
  );
};
