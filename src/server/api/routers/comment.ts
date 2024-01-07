import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const commentRouter = createTRPCRouter({
  addComment: protectedProcedure
    .input(
      z.object({
        recipeId: z.string(),
        text: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          text: input.text,
          recipe: { connect: { id: input.recipeId } },
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  deleteComment: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.delete({ where: { id: input } });
    }),

  updateComment: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        text: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.update({
        where: { id: input.id },
        data: { text: input.text },
      });
    }),

  listComments: publicProcedure
    .input(
      z.object({
        recipeId: z.string(),
        take: z.number().optional().default(10),
        skip: z.number().optional().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { recipeId, take, skip } = input;
      return ctx.db.comment.findMany({
        where: { recipeId },
        take,
        skip,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          text: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    }),
});
