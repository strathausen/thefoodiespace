import { type Recipe } from "@prisma/client";
import { aiModel } from "./ai-service";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { omit } from "lodash";

const parserInstructions = {
  keywords:
    "relevant words and synonyms that can be used for a semantic search index",
  moderation: "either APPROVED or REJECTED",
  reason:
    "why the recipe was approved or rejected, e.g. 'too spammy', 'not a recipe', 'profane', etc.",
};

const parser =
  StructuredOutputParser.fromNamesAndDescriptions(parserInstructions);

const prompt = PromptTemplate.fromTemplate(
  "We have this recipe {recipeJson}. Can you review this recipe? {formatInstructions}",
);

const chain = RunnableSequence.from([prompt, aiModel, parser]);

const formatInstructions = parser.getFormatInstructions();

export async function reviewRecipe(recipe: Recipe) {
  try {
    const result = await chain.invoke({
      recipeJson: JSON.stringify(omit(recipe, "moderation")),
      formatInstructions,
    });
    return result as typeof parserInstructions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
    return {
      keywords: "spam, nsfw, profane, irrelevant, not a recipe",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      reason: `error ${e.toString()}`,
      moderation: "REJECTED",
    };
  }
}
