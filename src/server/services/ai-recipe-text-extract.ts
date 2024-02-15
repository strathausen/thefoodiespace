import { type Recipe } from "@prisma/client";
import { PromptTemplate } from "@langchain/core/prompts";
import { aiModel } from "./ai-service";

// generate a recipe text based on a freetext
const recipeFormatExample: Pick<
  Recipe,
  "title" | "text" | "ingredients" | "info" | "steps"
> = {
  title: "string",
  text: "string",
  ingredients: [
    {
      name: "string",
      quantity: "string, e.g. 200, 1, 1/2, 1 1/2, etc.",
      unit: "string, e.g. cups, grams, pieces, etc.",
      notes: "string, optional, e.g. chopped, peeled, for the sauce, etc.",
    },
  ],
  steps: [
    {
      name: 'string, optional, e.g. "Step 1", "Preparation", "Cooking", etc.',
      text: "string",
      usedIngredients: 'string, optional, e.g. "flour, sugar, eggs", etc.',
    },
  ],
  info: {
    recipeYield: "string, e.g. 4, 6, 8, etc.",
    cookTime: "string, e.g. 30 minutes, 1 hour, etc.",
    prepTime: "string, e.g. easy, medium, hard, etc.",
  },
};

const template = `you are a json generator, answering only bare json of a recipe:

{formatInstructions}

please generate a json from the following recipe text:

"{recipeText}"

Don't number the steps. If there's a range of ingredients, choose the lower end and add "or more" to the notes.`;

const promptTemplate = PromptTemplate.fromTemplate(template);

const chain = promptTemplate.pipe(aiModel);

export async function extractRecipe(
  recipeText: string,
): Promise<
  Omit<Recipe, "createdAt" | "createdBy" | "createdById" | "originalText">
> {
  const result = await chain.invoke({
    recipeText,
    formatInstructions: JSON.stringify(recipeFormatExample),
  });
  return JSON.parse(result.replace("```json", "").replace("```", "")) as Recipe;
}

/* await extractRecipe(`
First proper meal I've cooked after eating Greek food for almost a month is my grandma's Beijing Zha Jiang Mian. Nothing will ever be more nostalgic and satisfying than this huge bowl of fried black beans sauce over wheat noodles and juicy cucumbers.

Serves 2 people:
250gr minced pork or beef
1 onion
3-4 cloves of garlic
2 tbsp black bean paste
200ml water
Toppings: green onions and cucumber

1. Chop garlic and onion.
2. Stir fry the meat until the edges are crispy.
3. Add garlic and onion, continue to stir fry until translucent.
4. Add black bean paste and mix very well in the pan, continue frying until everything is well incorporated.
5. Add water and simmer until the sauce thickens.
6. Boil noodles in hot water.
7. Chop green onions and cucumber.
8. Serve: Noodles first, sauce, cucumber and green onions.

Enjoooooy!

 `);
*/
