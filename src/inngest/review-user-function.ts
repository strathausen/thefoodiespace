import { type User } from "@prisma/client";
import { inngest } from "./client";

export const reviewUser = inngest.createFunction(
  { id: "review-user-function" },
  { event: "user/updated" },
  ({ event, }) => {
    const userUpdate = event.data as Partial<User>;
    // see what has changed
    return { event, body: "Hello, World!" };
  },
);
