import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter } from "@/server/api/trpc";
import { recipeRouter } from "./routers/recipe";
import { waitlistRouter } from "./routers/waitlist";
import { profileRouter } from "./routers/profile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  recipe: recipeRouter,
  waitlist: waitlistRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
