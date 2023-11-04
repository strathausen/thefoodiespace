import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { isNil, omitBy } from "lodash";

export const profileRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
      select: {
        name: true,
        bio: true,
        pronouns: true,
        image: true,
      },
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
        data: omitBy(
          {
            name: input.name,
            bio: input.bio,
            pronouns: input.pronouns,
            image: input.image,
          },
          isNil,
        ),
      });
    }),
});
