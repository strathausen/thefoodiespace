import { createTRPCRouter } from "@/server/api/trpc";
import { bookmarkRouter } from "./routers/bookmark";
import { commentRouter } from "./routers/comment";
import { profileRouter } from "./routers/profile";
import { recipeRouter } from "./routers/recipe";
import { waitlistRouter } from "./routers/waitlist";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  bookmark: bookmarkRouter,
  comment: commentRouter,
  profile: profileRouter,
  recipe: recipeRouter,
  waitlist: waitlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
