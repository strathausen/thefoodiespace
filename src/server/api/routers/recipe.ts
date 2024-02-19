import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { RecipeValidator } from "@/validators";
import {
  type Recipe,
  type Comment,
  type User,
  type PrismaClient,
} from "@prisma/client";
import { sendReactionNotification } from "@/server/services/notification-service";
import { reviewRecipe } from "@/server/services/ai-recipe-review";
import { indexRecipe, unindexRecipe } from "@/server/services/search-service";
import { extractRecipe } from "@/server/services/ai-recipe-text-extract";
import { inngest } from "@/inngest/client";

const select = {
  id: true,
  title: true,
  text: true,
  images: true,
  altImages: true,
  info: true,
  createdAt: true,
  updatedAt: true,
  createdById: true,
  ingredients: true,
  createdBy: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
  likeCount: true,
  commentCount: true,
  publishedAt: true,
  status: true,
};

const selectWithUser = (userId: string) => {
  return {
    ...select,
    reactions: { where: { userId }, select: { type: true } },
    comments: {
      where: { userId },
      select: { id: true, text: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: "desc" as const },
    },
  };
};

const getSelect = (userId: string | undefined) => {
  return userId ? selectWithUser(userId) : select;
};

// review the recipe and update its index on algolia
const reviewAndIndex = async (
  recipe: Recipe & { createdBy: User },
  db: PrismaClient,
) => {
  const review = await reviewRecipe(recipe);
  await db.recipe.update({
    where: { id: recipe.id },
    data: {
      moderation: review.moderation as "APPROVED" | "REJECTED",
      moderationReason: review.reason,
      aiKeywords: review.keywords.split(", "),
    },
  });
  if (review.moderation === "APPROVED") {
    await indexRecipe(recipe);
  } else {
    await unindexRecipe(recipe.id);
  }
};

export const recipeRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    const userId = ctx.session?.user?.id;
    return ctx.db.recipe.findMany({
      where: { status: "PUBLISHED", moderation: "APPROVED" },
      take: 10,
      orderBy: { createdAt: "desc" },
      select: getSelect(userId),
    });
  }),

  publicFeed: publicProcedure
    .input(
      z.object({
        take: z.number().default(10),
        skip: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const recipes = await ctx.db.recipe.findMany({
        where: { status: "PUBLISHED", moderation: "APPROVED" },
        take: input.take,
        skip: input.skip,
        orderBy: { id: "desc" },
        select,
      });
      return recipes;
    }),

  // show followed recipes from the last two days (or since last login?)
  // if scrolled down further, show more recent recipes that are approved
  // parameter for older recipes.... (cursor?)
  feed: protectedProcedure
    .input(
      z.object({
        cursor: z.string().optional(), // eventually, we want to use cursor instead of offset and take
        take: z.number().default(10),
        skip: z.number().default(0),
        explore: z.boolean().optional().default(true),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      const { take, skip, explore } = input;
      const followees = await ctx.db.follower.findMany({
        where: { followerId: userId },
        select: { followeeId: true },
      });
      const followeeIds = followees.map(({ followeeId }) => followeeId);
      const recipes = await ctx.db.recipe.findMany({
        where: {
          createdById: {
            not: userId,
            ...(explore ? { notIn: followeeIds } : { in: followeeIds }),
          },
          status: "PUBLISHED",
        },
        take,
        skip,
        orderBy: { id: "desc" },
        select: selectWithUser(userId),
      });
      return recipes;
    }),

  // published recipes by user
  userFeed: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        take: z.number().default(10),
        skip: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { take, skip, userId } = input;
      const where =
        ctx.session?.user.id === userId
          ? { createdById: userId }
          : { status: "PUBLISHED" as const, createdById: userId };
      const recipes = await ctx.db.recipe.findMany({
        where,
        take,
        skip,
        orderBy: { id: "desc" },
        select,
      });
      return recipes;
    }),

  get: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id;
    const OR = [{ status: "PUBLISHED" as const }, { createdById: userId }];
    const where = userId
      ? { id: input, OR }
      : { id: input, status: "PUBLISHED" as const };
    if (!userId) {
      const recipe = await ctx.db.recipe.findUniqueOrThrow({
        where,
        select: { steps: true, ...select },
      });
      return {
        ...recipe,
        comments: [] as Omit<Comment, "userId" | "recipeId">[],
      };
    }
    return ctx.db.recipe.findUniqueOrThrow({
      where,
      select: { steps: true, ...selectWithUser(userId) },
    });
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
        const recipe = await ctx.db.recipe.update({
          where: { id: input.id },
          data: { createdById, ...update, info },
          include: { createdBy: true },
        });
        // we only review published recipes, to save resources
        if (recipe.status === "PUBLISHED" && recipe.moderation !== "REJECTED") {
          await reviewAndIndex(recipe, ctx.db);
        }
        await inngest.send({
          name: "recipe/updated",
          data: { recipeId: recipe.id },
        });
        return recipe;
      }
      // new recipes aren't published by default and thus don't need a review
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
      const reaction = await ctx.db.reaction.create({
        data: {
          type: "LIKE",
          recipe: { connect: { id: input.id } },
          user: { connect: { id: ctx.session.user.id } },
        },
      });
      await sendReactionNotification(ctx.db, reaction.id).catch((err) =>
        console.error(err),
      );
      return reaction;
    }),

  unlike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.reaction
        .delete({
          where: {
            recipeId_userId_type: {
              recipeId: input.id,
              userId: ctx.session.user.id,
              type: "LIKE",
            },
          },
        })
        .catch(() => null);
    }),

  publish: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const recipe = await ctx.db.recipe.update({
        where: { id: input.id },
        data: { status: "PUBLISHED", publishedAt: new Date() },
        include: { createdBy: true },
      });
      await reviewAndIndex(recipe, ctx.db);
      return recipe;
    }),

  unpublish: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await unindexRecipe(input.id);
      return ctx.db.recipe.update({
        where: { id: input.id },
        data: { status: "DRAFT", publishedAt: null },
      });
    }),

  importFromText: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const createdById = ctx.session.user.id;
      const recipeData = await extractRecipe(input.text);
      const recipe = await ctx.db.recipe.create({
        data: {
          createdById,
          originalText: input.text,
          ...recipeData,
          altImages: {},
        },
        include: { createdBy: true },
      });
      return recipe;
    }),
});
