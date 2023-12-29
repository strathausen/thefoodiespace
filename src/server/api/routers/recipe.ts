import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { RecipeValidator } from "@/validators";

export const recipeRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.recipe.findMany({
      where: { status: "PUBLISHED", featured: true },
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        images: true,
        info: true,
        createdAt: true,
        updatedAt: true,
        createdById: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        publichedAt: true,
      },
    });
  }),
  get: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    const userId = ctx.session?.user?.id;
    const OR = [{ status: "PUBLISHED" as const }, { createdById: userId }];
    const where = userId
      ? { id: input, OR }
      : { id: input, status: "PUBLISHED" as const };
    return input ? ctx.db.recipe.findFirst({ where }) : null;
  }),
  listMine: protectedProcedure
    .input(
      z.object({
        take: z.number().optional().default(10),
        skip: z.number().optional().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const createdById = ctx.session.user.id;
      const recipe = await ctx.db.recipe.findMany({
        where: { createdById },
        ...input,
        orderBy: { createdAt: "desc" },
      });
      return recipe;
    }),
  getMine: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const createdById = ctx.session.user.id;
      return ctx.db.recipe.findFirst({
        where: { createdById, id: input },
      });
    }),
  upsert: protectedProcedure
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
      if (input.id) {
        return await ctx.db.recipe.update({
          where: { id: input.id },
          data: { createdById, ...update, info },
        });
      }
      return await ctx.db.recipe.create({
        data: {
          createdById,
          ...update,
          info,
        },
      });
    }),
});
