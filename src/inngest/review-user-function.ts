import { type User } from "@prisma/client";
import { inngest } from "./client";
import { reviewUser } from "@/server/services/ai-user-review";
import { db } from "@/server/db";

export const reviewUserFunction = inngest.createFunction(
  { id: "review-user-function" },
  { event: "user/updated" },
  async ({ event }) => {
    const userUpdate = event.data as Partial<User> & { id: string };

    const user = await db.user.findUniqueOrThrow({
      where: { id: userUpdate.id },
    });

    // rejected users are not reviewed again until reviewed by a human
    // admins and moderators do not need to be reviewed
    if (user.moderation === "REJECTED" || user.role !== "USER") {
      return { event, body: "User is not reviewed" };
    }

    const review = await reviewUser(userUpdate);

    await db.user.update({
      where: { id: userUpdate.id },
      data: {
        moderation: review.moderation as "APPROVED" | "REJECTED",
        // moderationReason: review.reason,
      },
    });
    return { event, body: review };
  },
);
