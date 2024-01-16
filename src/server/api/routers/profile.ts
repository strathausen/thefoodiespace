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
  handle: true,
  links: true,
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
        links: z.array(z.string()).optional(),
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
    .input(
      z.object({ id: z.string().optional(), handle: z.string().optional() }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.id && !input.handle) {
        throw new Error("Must provide either id or handle");
      }
      const profile = await ctx.db.user.findUnique({
        where: input.id ? { id: input.id } : { handle: input.handle },
        select,
      });
      return profile;
    }),

  updateHandle: protectedProcedure
    .input(
      z.object({
        handle: z
          .string()
          .toLowerCase()
          .regex(/^[a-z0-9_]+$/),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
        select,
      });
    }),
});
