import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { sendCommentNotification } from "@/server/services/notification-service";

export const commentRouter = createTRPCRouter({
  addComment: protectedProcedure
    .input(
      z.object({
        recipeId: z.string(),
        text: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.comment.create({
        data: {
          text: input.text,
          recipe: { connect: { id: input.recipeId } },
          user: { connect: { id: ctx.session.user.id } },
        },
      });
      sendCommentNotification(ctx.db, comment.id).catch((err) => {
        console.error(err);
      });
      return comment;
    }),

  deleteComment: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.delete({
        where: { id: input, userId: ctx.session.user.id },
      });
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
        where: { id: input.id, userId: ctx.session.user.id },
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
