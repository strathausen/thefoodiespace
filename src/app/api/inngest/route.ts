import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import {
  reviewRecipeImagesFunction,
  reviewUserFunction,
} from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [reviewRecipeImagesFunction, reviewUserFunction],
});
