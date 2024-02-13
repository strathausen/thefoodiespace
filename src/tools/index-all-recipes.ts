import { db } from "@/server/db";
import { indexRecipe } from "@/server/services/search-service";

// index all recipes if called directly, without using require
const recipes = await db.recipe.findMany({
  where: {
    publishedAt: { not: null },
    moderation: "APPROVED",
  },
  include: { createdBy: true },
});
for (const r of recipes) {
  console.log(await indexRecipe(r));
}
