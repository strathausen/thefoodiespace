import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { RecipeValidator } from "@/validators";
import { isNil, omitBy } from "lodash";

export const recipeRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.recipe.findMany({
      where: { status: "PUBLISHED", featured: true },
      take: 10,
      orderBy: { createdAt: "desc" },
    });
  }),
  get: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return input
      ? ctx.db.recipe.findFirst({
          where: { id: input, status: "PUBLISHED" },
        })
      : null;
  }),
  listMine: protectedProcedure
    .input(
      z.object({
        take: z.number().optional().default(10),
        skip: z.number().optional().default(0),
      }),
    )
    .query(({ ctx, input }) => {
      const createdById = ctx.session.user.id;
      return ctx.db.recipe.findMany({
        where: { createdById },
        ...input,
        orderBy: { createdAt: "desc" },
      });
    }),
  getMine: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const createdById = ctx.session.user.id;
      return ctx.db.recipe.findFirst({
        where: { createdById, id: input },
      });
    }),
  create: protectedProcedure
    .input(RecipeValidator)
    .mutation(async ({ ctx, input }) => {
      const createdById = ctx.session.user.id;
      const { recipeInfos, ...update } = input;
      const info = recipeInfos?.reduce(
        (acc, { key, value }) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      );
      return await ctx.db.recipe.create({
        data: {
          createdById,
          ...update,
          info,
        },
      });
    }),
});
