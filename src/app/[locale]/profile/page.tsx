"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Container, InputField } from "ui";
import { api } from "@/trpc/react";
import { UploadButton } from "@/utils/uploadthing";
import { AuthPage } from "@/app/api/auth/auth-page";
import { useScopedI18n } from "locales/client";

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
  const t = useScopedI18n("profile");

  const profileQuery = api.profile.get.useQuery();
  const profileUpdateMutation = api.profile.update.useMutation();

  useEffect(() => {
    if (profileQuery.data) {
      setName(profileQuery.data.name ?? "");
      setPronouns(profileQuery.data.pronouns ?? "");
      setBio(profileQuery.data.bio ?? "");
      setImage(profileQuery.data.image ?? "");
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
            <div className="p-4">
              <h1 className="pb-4 text-center text-xl">{t("title")}</h1>
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
                    className="rounded-full border-4 border-white object-cover shadow-md"
                    style={{ width: size, height: size }}
                    alt="profile pic"
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
                      } text-primary-darker hover:bg-primary/10 rounded text-md h-8 ${
                        isUploading ? "opacity-50" : ""
                      }`;
                    },
                  }}
                  content={{ button: "upload profile pic" }}
                />
                <InputField
                  label={t("name")}
                  name="name"
                  description={t("nameDescription")}
                  type="text"
                  placeholder="name"
                  value={name}
                  onChange={setName}
                  disabled={loading}
                />
                <InputField
                  label={t("bio")}
                  name="bio"
                  description={t("bioDescription")}
                  type="textarea"
                  placeholder="bio"
                  value={bio}
                  onChange={setBio}
                  disabled={loading}
                />
                <InputField
                  label={t("pronouns")}
                  name="pronouns"
                  description={t("pronounsDescription")}
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
            </div>
          </Container>
        </div>
      </AuthPage>
    </main>
  );
}
