"use client";
import { useEffect, useState } from "react";
import { InputField } from "../_components/input-field";
import { api } from "@/trpc/react";
import { UploadButton } from "@/utils/uploadthing";

const size = 130;

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [success, setSuccess] = useState(false);
  const [image, setImage] = useState<string>();

  const profileQuery = api.profile.get.useQuery();
  const profileUpdateMutation = api.profile.update.useMutation();

  useEffect(() => {
    if (profileQuery.data) {
      setName(profileQuery.data.name!);
      setPronouns(profileQuery.data.pronouns!);
      setBio(profileQuery.data.bio!);
      setPronouns(profileQuery.data.pronouns!);
      setImage(profileQuery.data.image!);
    }
  }, [profileQuery.data]);

  const handleSubmit = () => {
    if (!name) {
      alert("name is required");
      return;
    }

    profileUpdateMutation.mutate({ name, bio, pronouns, image });
    setSuccess(true);
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  }, [success]);

  const loading = profileUpdateMutation.isLoading || profileQuery.isLoading;
  const error = profileUpdateMutation.error ?? profileQuery.error;

  return (
    <main>
      <div className="mt-10 max-w-xl">
        <h1 className="py-6 text-xl underline decoration-accent">
          profile page
        </h1>
        <form
          onSubmit={(e) => {
            handleSubmit();
            e.preventDefault();
          }}
          className="rounded border border-accent-alt p-4"
        >
          <div className="mb-2 flex justify-center">
            {image ? (
              <img src={image} width={size} className="rounded-full" />
            ) : (
              <div
                className="rounded-full bg-primary-light"
                style={{ width: size, height: size }}
              />
            )}
          </div>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res) {
                setImage(res[0]?.url);
                handleSubmit();
              }
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
            className="mb-4"
            appearance={{
              button({ ready, isUploading }) {
                return "bg-primary/20 border-primary text-primary-darker hover:bg-primary/10 rounded border text-md h-8";
              },
              allowedContent() {
                return "text-pink";
              },
            }}
            content={{ button: "upload profile pic" }}
          />
          <InputField
            label="name"
            name="name"
            description="what should we call you?"
            type="text"
            placeholder="name"
            value={name}
            onChange={setName}
            disabled={loading}
          />
          <InputField
            label="bio"
            name="bio"
            description="brag about yourself!" // TODO enable markdown
            type="textarea"
            placeholder="bio"
            value={bio}
            onChange={setBio}
            disabled={loading}
          />
          <InputField
            label="pronouns"
            name="pronouns"
            description="how do you identify?"
            type="text"
            placeholder="pronouns"
            value={pronouns}
            onChange={setPronouns}
            disabled={loading}
          />
          <div className="mt-4 flex flex-row items-center justify-end gap-3">
            {error && (
              <p className="text-accent">
                Something went wrong! {error.message}
              </p>
            )}

            <p
              className={`text-accent-alt ${
                success ? "opacity-100" : "opacity-0"
              } transition-opacity duration-700 ease-out`}
            >
              profile updated!
            </p>
            <button
              className="rounded border border-accent px-3 py-1"
              type="submit"
              disabled={loading}
            >
              submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
