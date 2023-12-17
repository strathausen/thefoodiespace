"use client";
import { useEffect, useState } from "react";
import { InputField } from "../_components/input-field";
import { api } from "@/trpc/react";
import { UploadButton } from "@/utils/uploadthing";
import { AuthPage } from "../api/auth/auth-page";
import { Container } from "../_components/container";
import { Button } from "../_components/button";
import Image from "next/image";

const size = 130;

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [success, setSuccess] = useState(false);
  const [image, setImage] = useState<string>();
  const [validationError, setValidationError] = useState<string | undefined>(
    undefined,
  );

  const profileQuery = api.profile.get.useQuery();
  const profileUpdateMutation = api.profile.update.useMutation();

  useEffect(() => {
    if (profileQuery.data) {
      setName(profileQuery.data.name!);
      setPronouns(profileQuery.data.pronouns!);
      setBio(profileQuery.data.bio!);
      setImage(profileQuery.data.image!);
    }
  }, [profileQuery.data]);

  const handleSubmit = () => {
    if (!name) {
      setValidationError("name is required");
      return;
    }
    setValidationError(undefined);
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
      <AuthPage>
        <div className="mx-auto mt-10 max-w-xl">
          <Container>
            <h1 className="pb-4 text-center text-xl">your profile</h1>
            <form
              onSubmit={(e) => {
                handleSubmit();
                e.preventDefault();
              }}
            >
              <div className="mb-2 flex justify-center">
                <Image
                  src={image ?? "/default-profile-pic.png"}
                  width={size}
                  height={size}
                  className="rounded-full"
                  alt='profile pic'
                />
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
                    return `bg-primary/20 ${
                      ready ? "border-green" : "border-primary"
                    } text-primary-darker hover:bg-primary/10 rounded border text-md h-8 ${
                      isUploading ? "opacity-50" : ""
                    }`;
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
                  <p className="text-red-600">
                    Something went wrong! {error.message}
                  </p>
                )}
                {validationError && (
                  <p className="text-red-600">{validationError}</p>
                )}
                <p
                  className={`text-green-600 ${
                    success ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-700 ease-out`}
                >
                  profile updated!
                </p>
                <Button disabled={loading}>submit</Button>
              </div>
            </form>
          </Container>
        </div>
      </AuthPage>
    </main>
  );
}
