import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { reviewUser } from "@/inngest/review-user-function";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
		reviewUser
  ],
});
