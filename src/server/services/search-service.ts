import algoliasearch from "algoliasearch";
import { type User, type Recipe } from "@prisma/client";
import { env } from "@/env.mjs";
import { omit } from "lodash";

const algoliaClient = algoliasearch(
  env.ALGOLIA_APP_ID,
  env.ALGOLIA_WRITE_API_KEY,
);
const algoliaIndex = algoliaClient.initIndex("recipes");

export async function indexRecipe(
  recipe: Recipe & { createdBy: User; keywords?: string[] },
) {
  await algoliaIndex.saveObject({
    objectID: recipe.id,
    ...omit(recipe, "commentCount"),
  });
}

export async function unindexRecipe(recipeId: string) {
  await algoliaIndex.deleteObject(recipeId);
}

/* partial update */
export async function updateRecipeIndex(
  recipe: Partial<Recipe> & { id: string },
) {
  await algoliaIndex.partialUpdateObject({
    objectId: recipe.id,
    ...recipe,
  });
}
