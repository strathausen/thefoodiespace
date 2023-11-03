import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const waitlistRouter = createTRPCRouter({
  add: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.waitlist.upsert({
        create: { email: input.email },
        update: {},
        where: { email: input.email },
      });
    }),
});
