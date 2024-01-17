import type { RecipeJson } from "@/types";
import { type api } from "@/trpc/server";

export function createRecipeJson(
  recipe: Awaited<ReturnType<typeof api.recipe.get.query>>,
): RecipeJson {
  return {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    name: recipe.name,
    image: recipe.images,
    author: {
      "@type": "Person",
      name: recipe.createdBy.name ?? "unknown",
    },
    datePublished: (recipe.publishedAt ?? recipe.createdAt).toISOString(),
    description: recipe.text!,
    prepTime: recipe.info.prepTime,
    cookTime: recipe.info.cookTime,
    totalTime: recipe.info.totalTime,
    keywords: recipe.info.keywords, // TODO: use tags from description as well
    recipeYield: recipe.info.recipeYield!,
    // recipeCategory: recipe.info.recipeCategory, // TODO: use tags from description
    // recipeCuisine: recipe.info.recipeCuisine, // TODO: use tags from description
    nutrition: recipe.info["nutrition.calories"]
      ? {
          "@type": "NutritionInformation",
          calories: recipe.info["nutrition.calories"],
        }
      : undefined,
    recipeIngredient: recipe.ingredients.map((ingredient) => {
      return `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`;
    }),
    recipeInstructions: recipe.steps.map((step, i) => {
      return {
        "@type": "HowToStep",
        name: step.name!,
        text: step.text!,
        url: `https://www.tomatovillage.com/recipe/${recipe.id}/#step-${i + 1}`,
        image: step.images ? step.images[0] : "",
      };
    }),
  };
}
