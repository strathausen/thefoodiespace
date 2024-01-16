"use client";
import { api } from "@/trpc/react";
import { truncate } from "lodash";
import { useEffect } from "react";

type NotificationContent = {
  reactor: {
    id: string;
    name: string;
  };
  comment: {
    id: string;
    text: string;
  };
  text: string;
  recipe: {
    id: string;
    name: string;
  };
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
                  💬 {content.reactor?.name || "someone"} commented on your
                  recipe &quot;{content.recipe.name}&quot;: &quot;
                  {truncate(content.text, { length: 100 })}&quot;
                </p>
              </div>
            );
          }
          if (notification.type === "REACTION") {
            return (
              <div key={notification.id} className={className}>
                <p>
                  ❤ {content.reactor?.name || "someone"} liked your recipe
                  &quot;
                  {content.recipe.name}&quot;
                </p>
              </div>
            );
          }
          if (notification.type === "FOLLOW") {
            return (
              <div key={notification.id} className={className}>
                <p>
                  ✨ {content.reactor?.name || "someone"} started following you
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
