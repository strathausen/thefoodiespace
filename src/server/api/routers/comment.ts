import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { sendCommentNotification } from "@/server/services/notification-service";
import { reviewComment } from "@/server/services/ai-comment-review";

export const commentRouter = createTRPCRouter({
  addComment: protectedProcedure
    .input(
      z.object({
        recipeId: z.string(),
        text: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const commenter = await ctx.db.user.findUniqueOrThrow({
        where: { id: ctx.session.user.id },
        select: { id: true, name: true, image: true, role: true },
      });
      const reviewNeeded = commenter.role === "USER";
      const review = reviewNeeded
        ? await reviewComment(commenter.name!, input.text)
        : { moderation: "APPROVED" as const, reason: "is admin or moderator" };
      const comment = await ctx.db.comment.create({
        data: {
          text: input.text,
          moderation: review.moderation as "APPROVED" | "REJECTED",
          moderationReason: review.reason,
          recipe: { connect: { id: input.recipeId } },
          user: { connect: { id: ctx.session.user.id } },
        },
      });
      if (review.moderation === "APPROVED")
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
      const userId = ctx.session?.user?.id;
      const where = userId
        ? { recipeId, OR: [{ moderation: "APPROVED" as const }, { userId }] }
        : { recipeId, moderation: "APPROVED" as const };
      return ctx.db.comment.findMany({
        where,
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
