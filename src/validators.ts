import { z } from "zod";

export const RecipeValidator = z.object({
  id: z.string().optional(),
  name: z.string(),
  text: z.string().optional(),
  images: z.array(z.string()).optional(),
  sourceUrl: z.string().optional(),
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
        name: z.string().optional(),
        text: z.string().optional(),
        images: z.array(z.string()).optional(),
        usedIngredients: z.string().optional(),
      }),
    )
    .optional()
    .default([]),
  recipeInfos: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
});
