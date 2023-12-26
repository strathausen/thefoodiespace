import { api } from "@/trpc/server";
import Image from "next/image";
import { Container } from "ui/index";

export default async function UserPage({
  params,
}: {
  params: { userId: string };
}) {
  const userProfile = await api.profile.viewProfile.query({
    id: params.userId,
  });

  return (
    <main className="m-auto mt-8 max-w-md">
      <Container>
        <div className="p-6">
          <h1 className="pb-2 text-center text-xl">{userProfile.name}</h1>
          {userProfile.pronouns && (
            <p className="text-center text-stone-700 pb-4 text-sm">
              pronouns {userProfile.pronouns}
            </p>
          )}
          {userProfile.image && (
            <div className="flex justify-center">
              <Image
                className="rounded-full"
                src={userProfile.image}
                alt={userProfile.name!}
                width={200}
                height={200}
              />
            </div>
          )}
          <p className="m-auto max-w-xs pt-3">{userProfile.bio}</p>
        </div>
      </Container>
    </main>
  );
}
