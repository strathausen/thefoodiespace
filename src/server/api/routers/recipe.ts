import type { RecipeFeedItem } from "@/types";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

const recipes: RecipeFeedItem[] = [
  {
    id: 1,
    title: "granny's angry scary tomato pumkin",
    media: [
      {
        type: "image",
        url: "scary-tomato-pumpkin-1.png",
      },
      {
        type: "image",
        url: "scary-tomato-pumpkin-2.png",
      },
      {
        type: "image",
        url: "scary-tomato-pumpkin-3.png",
      },
      {
        type: "image",
        url: "scary-tomato-pumpkin-4.png",
      },
    ],
    author: {
      name: "Jane Doe",
      avatar: "https://avatars.githubusercontent.com/u/201042?v=4",
    },
    reactions: [
      {
        type: "like",
        count: 10,
        liked: true,
      },
      {
        type: "love",
        count: 2,
      },
      {
        type: "haha",
        count: 1,
      },
    ],
  },
];

export const recipeRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return recipes;
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        text: z.string().optional(),
        images: z.array(z.string()).optional(),
        ingredients: z
          .array(
            z.object({
              quantity: z.string(),
              unit: z.string(),
              name: z.string(),
              notes: z.string().optional(),
            }),
          )
          .optional(),
        steps: z
          .array(
            z.object({
              text: z.string(),
              images: z.array(z.string()).optional(),
            }),
          )
          .optional(),
        recipeInfos: z
          .array(
            z.object({
              key: z.string(),
              value: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return ctx.db;
    }),
});
