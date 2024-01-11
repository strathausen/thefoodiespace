import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { isNil, omitBy } from "lodash";

const select = {
  id: true,
  name: true,
  bio: true,
  pronouns: true,
  image: true,
};

export const profileRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
      select,
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        bio: z.string().optional(),
        pronouns: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: omitBy(input, isNil),
        select,
      });
    }),

  viewProfile: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.db.user.findUnique({
        where: { id: input.id },
        select,
      });

      if (!profile) {
        throw new Error("Profile not found");
      }

      return profile;
    }),
});
