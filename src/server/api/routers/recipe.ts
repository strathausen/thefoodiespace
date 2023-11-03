import type { RecipeFeedItem } from "@/types";
import { createTRPCRouter, publicProcedure } from "../trpc";

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
});
