import { createTRPCRouter } from "@/server/api/trpc";
import { recipeRouter } from "./routers/recipe";
import { waitlistRouter } from "./routers/waitlist";
import { profileRouter } from "./routers/profile";
import { bookmarkRouter } from "./routers/bookmark";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  recipe: recipeRouter,
  waitlist: waitlistRouter,
  profile: profileRouter,
  bookmark: bookmarkRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
