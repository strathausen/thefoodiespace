import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const bookmarkRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({ recipeId: z.string(), cookBookId: z.string().optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      const { recipeId, cookBookId } = input;
      const exists = await ctx.db.bookmark.findFirst({
        where: { recipeId, userId, cookBookId },
      });
      if (exists) {
        return exists;
      }
      return ctx.db.bookmark.create({
        data: { recipeId, cookBookId, userId },
      });
    }),

  remove: protectedProcedure
    .input(
      z.union([
        z.object({
          id: z.string(),
          recipeId: z.undefined(),
          cookBookId: z.undefined(),
        }),
        z.object({
          id: z.undefined(),
          recipeId: z.string(),
          cookBookId: z.string().optional(),
        }),
      ]),
    )
    .mutation(async ({ ctx, input: { id, recipeId, cookBookId } }) => {
      const userId = ctx.session?.user?.id;
      if (id) {
        return ctx.db.bookmark.delete({
          where: { id, userId },
        });
      }
      if (recipeId) {
        return ctx.db.bookmark.deleteMany({
          where: { recipeId, userId, cookBookId },
        });
      }
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), cookBookId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      const { id, cookBookId } = input;
      return ctx.db.bookmark.update({
        where: { id, userId },
        data: { cookBookId },
      });
    }),

  list: protectedProcedure
    .input(
      z.object({ take: z.number().optional(), skip: z.number().optional() }),
    )
    .query(async ({ ctx }) => {
      const itemsQuery = ctx.db.bookmark.findMany({
        where: { userId: ctx.session.user.id },
        select: { recipe: { select: { id: true, name: true } } },
      });
      const countQuery = ctx.db.bookmark.count({
        where: { userId: ctx.session.user.id },
      });
      const [items, count] = await Promise.all([itemsQuery, countQuery]);
      return { items, count };
    }),
});
