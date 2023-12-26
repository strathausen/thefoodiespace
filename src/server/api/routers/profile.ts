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

  follow: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.user.findUnique({
        where: { id: input.id },
      });

      if (!profile) {
        throw new Error("Profile not found");
      }

      return ctx.db.follower.create({
        data: {
          type: "FOLLOWER",
          follower: { connect: { id: ctx.session.user.id } },
          followee: { connect: { id: input.id } },
        },
      });
    }),

  unfollow: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.user.findUnique({
        where: { id: input.id },
      });

      if (!profile) {
        throw new Error("Profile not found");
      }

      return ctx.db.follower.delete({
        where: {
          followerId_followeeId: {
            followerId: ctx.session.user.id,
            followeeId: input.id,
          },
        },
      });
    }),

  myFollowers: protectedProcedure
    .input(
      z.object({ take: z.number().optional(), skip: z.number().optional() }),
    )
    .query(async ({ ctx }) => {
      const itemsQuery = ctx.db.follower.findMany({
        where: { followeeId: ctx.session.user.id },
        select: { follower: { select } },
      });
      const countQuery = ctx.db.follower.count({
        where: { followeeId: ctx.session.user.id },
      });
      const [items, count] = await Promise.all([itemsQuery, countQuery]);
      return { items, count };
    }),

  myFollowees: protectedProcedure
    .input(
      z.object({ take: z.number().optional(), skip: z.number().optional() }),
    )
    .query(async ({ ctx }) => {
      const itemsQuery = ctx.db.follower.findMany({
        where: { followerId: ctx.session.user.id },
        select: { followee: { select } },
      });
      const countQuery = ctx.db.follower.count({
        where: { followerId: ctx.session.user.id },
      });
      const [items, count] = await Promise.all([itemsQuery, countQuery]);
      return { items, count };
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
