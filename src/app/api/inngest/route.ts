import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { reviewRecipeImage, reviewUser } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [reviewRecipeImage, reviewUser],
});
