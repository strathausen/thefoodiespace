import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const notificationRouter = createTRPCRouter({
  listNotifications: protectedProcedure
    .input(
      z.object({
        take: z.number().optional().default(10),
        skip: z.number().optional().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { take, skip } = input;
      const notificationQuery = ctx.db.notification.findMany({
        where: { userId: ctx.session.user.id },
        take,
        skip,
        select: {
          id: true,
          type: true,
          createdAt: true,
          readAt: true,
          content: true,
        },
        orderBy: { createdAt: "desc" },
      });
      const countQuery = ctx.db.notification.count({
        where: { userId: ctx.session.user.id },
      });
      const [notifications, count] = await ctx.db.$transaction([
        notificationQuery,
        countQuery,
      ]);
      return { notifications, count };
    }),

  readNotification: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.notification.updateMany({
        where: { id: { in: input }, userId: ctx.session.user.id },
        data: { readAt: new Date() },
      });
    }),

  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.notification.count({
      where: { userId: ctx.session.user.id, readAt: null },
    });
  }),
});
