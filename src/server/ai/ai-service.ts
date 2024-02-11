import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { type Recipe } from "@prisma/client";

export const openAIModel = new OpenAI({
  modelName: "gpt-4-turbo-preview",
  temperature: 0,
});

// rate comments on recipes: relevance, helpfulness, kindness, spammyness, profanity, etc.
const rateCommentParser = StructuredOutputParser.fromNamesAndDescriptions({
  relevance: "How relevant is this comment to the recipe?",
  helpfulness: "How helpful is this comment?",
  kindness: "How kind is this comment?",
  spammyness: "How spammy is this comment?",
  profanity: "How profane is this comment?",
});
const rateCommentPrompt = PromptTemplate.fromTemplate(
  "We have this recipe {recipeSummary}. Can you judge this comment {comment}? \n {format_instructions}",
);

const rateCommentChain = RunnableSequence.from([
  rateCommentPrompt,
  openAIModel,
  rateCommentParser,
]);
export async function rateComment(comment: string, recipeSummary: string) {
  return rateCommentChain.invoke({
    comment,
    recipeSummary,
    format_instructions: rateCommentParser.getFormatInstructions(),
  });
}

const result = await rateComment("This cake is amazing!", "a delicious cake");
console.log(result.foobarxx);

/**
 * my use cases for the AI service
 * - rate recipes: relevance (is it a recipe?), spammyness, profanity
 * - describe images to add alt tags and rating: what's in the image? is it relevant to the recipe? is it spammy? is it profane?
 * - import recipes from other sites: extract recipe text, images, steps, ingredients and metadata
 */

const recipeNamesAndDescriptions = {
  summary: "summary in two-three sentences",
  index: "relevant words that can be used for a semantic search index",
  tags: "cool social media tags, comma separated",
  ratings:
    "ok, spam, nsfw, profane, irrelevant, not a recipe, etc. comma separated",
};

// export async function getRecipeData(
//   recipe: Recipe,
// ): Promise<typeof recipeNamesAndDescriptions> {
//   return {
//     foo: "bar",
//     summary: "summary in two sentences",
//   };
// }
