"use client";
import { api } from "@/trpc/react";
import { useEffect } from "react";

type NotificationContent = {
  reactor: {
    id: string;
    name: string;
  };
  comment: {
    id: string;
    content: string;
  };
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
      markAsReadMutation.mutate(
        notificationsQuery.data.notifications.map((n) => n.id),
      );
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [markAsReadMutation, notificationsQuery.data]);

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="font-vollkorn">notifications</h1>
      <div>
        {notificationsQuery.data?.notifications.map((notification) => {
          const content = notification.content as NotificationContent;
          if (notification.type === "COMMENT") {
            return (
              <div key={notification.id}>
                <p>
                  {content.reactor?.name || "someone"} commented on your recipe
                  &quot;{content.recipe.name}&quot;
                </p>
              </div>
            );
          }
          if (notification.type === "REACTION") {
            return (
              <div key={notification.id}>
                <p>
                  {content.reactor?.name || "someone"} liked your recipe &quot;
                  {content.recipe.name}&quot;
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
