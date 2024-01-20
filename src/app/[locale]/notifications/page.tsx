"use client";
import Link from "next/link";
import { api } from "@/trpc/react";
import { truncate } from "lodash";
import { useEffect } from "react";

type NotificationContent = {
  reactor: {
    id: string;
    handle?: string;
    name: string;
  };
  commenter: {
    id: string;
    handle?: string;
    name: string;
  };
  text: string;
  recipe: {
    id: string;
    name: string;
  };
};

const UserLink = ({ user }: { user: NotificationContent["reactor"] }) => {
  if (!user) return null; // for old data in the db, shouldn't happen anymore
  if (user.handle) {
    return (
      <Link href={`/~${user.handle}`} className="font-semibold">
        {user.name}
      </Link>
    );
  }
  return (
    <Link href={`/user/${user.id}`} className="font-semibold">
      {user.name}
    </Link>
  );
};

const RecipeLink = ({
  recipe,
  href,
}: {
  recipe: NotificationContent["recipe"];
  href?: string;
}) => {
  return (
    <Link
      href={`/recipe/${recipe.id}${href ? "#" + href : ""}`}
      className="font-semibold"
    >
      {recipe.name}
    </Link>
  );
};

export default function NotificationsPage() {
  const notificationsQuery = api.notification.listNotifications.useQuery({});
  const markAsReadMutation = api.notification.readNotification.useMutation();

  useEffect(() => {
    //  timeout
    if (!notificationsQuery.data) {
      return;
    }
    const timeout = setTimeout(() => {
      markAsReadMutation
        .mutateAsync(notificationsQuery.data.notifications.map((n) => n.id))
        .then(() => notificationsQuery.refetch())
        .catch((e) => {
          console.error(e);
        });
    }, 4500);
    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationsQuery.data]);

  return (
    <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-4 p-4">
      <h1 className="font-vollkorn text-2xl">notifications</h1>
      <div className="flex flex-col gap-2">
        {notificationsQuery.data?.notifications.map((notification) => {
          const content = notification.content as NotificationContent;
          const className = notification.readAt ? "opacity-50" : "";
          if (notification.type === "COMMENT") {
            return (
              <div key={notification.id} className={className}>
                <p>
                  💬 <UserLink user={content.commenter} /> commented on your
                  recipe &quot;
                  <RecipeLink recipe={content.recipe} href="comments" />
                  &quot; : &quot;
                  {truncate(content.text, { length: 100 })}&quot;
                </p>
              </div>
            );
          }
          if (notification.type === "REACTION") {
            return (
              <div key={notification.id} className={className}>
                <p>
                  ❤ <UserLink user={content.reactor} /> liked your recipe
                  &quot;
                  <RecipeLink recipe={content.recipe} />
                  &quot;
                </p>
              </div>
            );
          }
          if (notification.type === "FOLLOW") {
            return (
              <div key={notification.id} className={className}>
                <p>
                  ✨ <UserLink user={content.reactor} /> started following you
                </p>
              </div>
            );
          }
          return <div key={notification.id}>{notification.type}</div>;
        })}
      </div>
    </div>
  );
}
