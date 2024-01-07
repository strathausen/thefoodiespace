import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { RecipeValidator } from "@/validators";

const select = {
  id: true,
  name: true,
  text: true,
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
  likeCount: true,
  commentCount: true,
  publichedAt: true,
};

const selectWithUser = (userId: string) => {
  return {
    ...select,
    reactions: { where: { userId }, select: { type: true } },
    bookmarks: {
      where: { userId },
      select: { id: true, cookBookId: true },
    },
  };
};

const getSelect = (userId: string | undefined) => {
  return userId ? selectWithUser(userId) : select;
};

export const recipeRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    const userId = ctx.session?.user?.id;
    return ctx.db.recipe.findMany({
      where: { status: "PUBLISHED", featured: true },
      take: 10,
      orderBy: { createdAt: "desc" },
      select: getSelect(userId),
    });
  }),

  feed: protectedProcedure
    .input(
      z.object({
        cursor: z.string().optional(), // eventually, we want to use cursor instead of offset and take
        take: z.number().default(10),
        skip: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      const { take, skip } = input;
      const followees = await ctx.db.follower.findMany({
        where: { followerId: userId },
        select: { followeeId: true },
      });
      const OR = [{ status: "PUBLISHED" as const }, { createdById: userId }];
      const where = { OR };
      const recipes = await ctx.db.recipe.findMany({
        where: {
          ...where,
          createdById: { in: followees.map(({ followeeId }) => followeeId) },
        },
        take,
        skip,
        orderBy: { publichedAt: "desc" },
        select: selectWithUser(userId),
      });
      return recipes;
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
      const recipes = await ctx.db.recipe.findMany({
        where: { createdById },
        ...input,
        orderBy: { createdAt: "desc" },
        select: selectWithUser(createdById),
      });
      console.log(recipes[0]?.bookmarks)
      return recipes;
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

  like: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.reaction.create({
        data: {
          type: "LIKE",
          recipe: { connect: { id: input.id } },
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  unlike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.reaction.delete({
        where: {
          recipeId_userId_type: {
            recipeId: input.id,
            userId: ctx.session.user.id,
            type: "LIKE",
          },
        },
      });
    }),

  addComment: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        text: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          text: input.text,
          recipe: { connect: { id: input.id } },
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
        id: z.string(),
        take: z.number().optional().default(10),
        skip: z.number().optional().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id: recipeId, take, skip } = input;
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
