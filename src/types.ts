export type RecipeStep = {
  images?: string[];
  name?: string;
  text?: string;
  usedIngredients?: string;
};

export type RecipeIngredient = {
  quantity: string;
  unit: string;
  name: string;
  notes?: string;
};

export type RecipeInfo = {
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  keywords?: string;
  recipeYield?: string;
  recipeCategory?: string;
  recipeCuisine?: string;
  'nutrition.calories'?: string
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PrismaJson {
    type RecipeSteps = RecipeStep[];
    type RecipeIngredient = {
      quantity: string;
      unit: string;
      name: string;
      notes?: string;
    };
    type RecipeInfos = RecipeInfo;
    type RecipeStep = {
      images?: string[] | string;
      name?: string;
      text?: string;
      usedIngredients?: string;
    };
  }
}
