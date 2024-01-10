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
    <main className="m-auto mt-8 max-w-2xl w-full">
      <Container>
        <div className="p-6">
          <h1 className="pb-2 text-center text-xl font-vollkorn">{userProfile.name}</h1>
          {userProfile.pronouns && (
            <p className="pb-4 text-center text-sm text-stone-700/80">
              pronouns {userProfile.pronouns}
            </p>
          )}
          {userProfile.image && (
            <div className="flex justify-center">
              <Image
                className="rounded-full object-cover"
                src={userProfile.image ?? "/default-profile-image.webp"}
                alt={userProfile.name!}
                width={200}
                height={200}
                style={{ width: 200, height: 200 }}
              />
            </div>
          )}
          <p className="m-auto max-w-xs pt-3">{userProfile.bio}</p>
        </div>
      </Container>
    </main>
  );
}
