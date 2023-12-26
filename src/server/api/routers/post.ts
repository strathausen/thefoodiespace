import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  like: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({ where: { id: input.id } });

      if (!post) {
        throw new Error("Post not found");
      }

      return ctx.db.reaction.create({
        data: {
          type: "LIKE",
          post: { connect: { id: input.id } },
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  unlike: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({ where: { id: input.id } });

      if (!post) {
        throw new Error("Post not found");
      }

      return ctx.db.reaction.delete({
        where: {
          postId_userId: { postId: input.id, userId: ctx.session.user.id },
        },
      });
    }),
});
