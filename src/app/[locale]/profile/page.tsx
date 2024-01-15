"use client";
import Image from "next/image";
import Link from "next/link";
import { FaCheck, FaDoorOpen, FaPen } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { Button, Container, InputField } from "ui";
import { api } from "@/trpc/react";
import { UploadButton } from "@/utils/uploadthing";
import { AuthPage } from "@/app/api/auth/auth-page";
import { useScopedI18n } from "locales/client";
import { LanguageSwitcher } from "components/buttons/language-switcher";

const size = 130;

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [success, setSuccess] = useState(false);
  const [image, setImage] = useState<string>();
  const [handle, setHandle] = useState<string>("");
  const [links, setLinks] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | undefined>(
    undefined,
  );
  const [editHandle, setEditHandle] = useState(false);
  const t = useScopedI18n("profile");

  const profileQuery = api.profile.get.useQuery();
  const profileUpdateMutation = api.profile.update.useMutation();
  const handleUpdateMutation = api.profile.updateHandle.useMutation();

  useEffect(() => {
    if (profileQuery.data) {
      setName(profileQuery.data.name ?? "");
      setPronouns(profileQuery.data.pronouns ?? "");
      setBio(profileQuery.data.bio ?? "");
      setImage(profileQuery.data.image ?? "");
      setHandle(profileQuery.data.handle ?? "");
      setLinks(profileQuery.data.links ?? []);
    }
  }, [profileQuery.data]);

  const handleSubmit = () => {
    if (!name) {
      setValidationError("name is required");
      return;
    }
    setValidationError(undefined);
    profileUpdateMutation.mutate({ name, bio, pronouns, image, links });
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
        <div className="my-auto mt-10 w-full max-w-xl">
          <Container>
            <div className="p-4">
              <h1 className="pb-4 text-center text-xl">{t("title")}</h1>
              <form
                onSubmit={(e) => {
                  handleSubmit();
                  e.preventDefault();
                }}
                className="flex flex-col gap-4"
              >
                <div className="mb-2 flex justify-center">
                  <Image
                    src={image ?? "/default-profile-image.webp"}
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
                <InputField
                  label={t("links")}
                  name="links"
                  description={t("linksDescription")}
                  type="textarea"
                  placeholder="links"
                  value={links.join("\n")}
                  onChange={(val) => {
                    setLinks(val.split(/[\n\r]+/g));
                  }}
                  disabled={loading}
                />
                {/* user handle */}
                <div className="flex justify-center gap-2">
                  <div className="flex-1">
                    <InputField
                      label={t("handle")}
                      name="handle"
                      description={t("handleDescription")}
                      type="text"
                      placeholder="handle"
                      value={handle}
                      disabled={!editHandle}
                      onChange={setHandle}
                    />
                  </div>
                  <div className="pt-2">
                    {editHandle ? (
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          setValidationError(undefined);
                          try {
                            await handleUpdateMutation.mutateAsync({ handle });
                            setEditHandle(false);
                          } catch (e) {
                            setValidationError("handle already taken");
                          }
                        }}
                      >
                        <FaCheck className="text-green-600" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setEditHandle(true);
                        }}
                      >
                        <FaPen className="text-primary-darker" />
                      </button>
                    )}
                  </div>
                </div>

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
                  <Button disabled={loading}>💾&nbsp;save</Button>
                </div>
              </form>
              <div className="">
                <div>
                  <LanguageSwitcher />{" "}
                  <span className="ml-3 text-primary-darker">
                    switch language
                  </span>
                </div>
                <Link
                  href={"/api/auth/signout"}
                  className="flex items-center gap-4 rounded-sm text-primary-darker transition"
                >
                  <FaDoorOpen /> log out
                  {/* {t("logout")} */}
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </AuthPage>
    </main>
  );
}
