import type { RecipeFeedItem } from "@/types";
import { createTRPCRouter, publicProcedure } from "../trpc";

const recipes: RecipeFeedItem[] = [
  {
    id: 1,
    title: "How to make a sandwich",
    media: [
      {
        type: "image",
        url: "https://img.freepik.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19744.jpg?w=2000&t=st=1698691931~exp=1698692531~hmac=56002e615ffe4dc04fcb947df84ed965464f332b8768419035e0bc9208112a5b",
      },
      {
        type: "image",
        url: "https://img.freepik.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19744.jpg?w=2000&t=st=1698691931~exp=1698692531~hmac=56002e615ffe4dc04fcb947df84ed965464f332b8768419035e0bc9208112a5b",
      },
      {
        type: "image",
        url: "https://img.freepik.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19744.jpg?w=2000&t=st=1698691931~exp=1698692531~hmac=56002e615ffe4dc04fcb947df84ed965464f332b8768419035e0bc9208112a5b",
      },
      {
        type: "image",
        url: "https://img.freepik.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19744.jpg?w=2000&t=st=1698691931~exp=1698692531~hmac=56002e615ffe4dc04fcb947df84ed965464f332b8768419035e0bc9208112a5b",
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
