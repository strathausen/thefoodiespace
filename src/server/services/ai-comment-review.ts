import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { aiModel } from "./ai-service";

// rate comments on recipes: relevance, helpfulness, kindness, spammyness, profanity, etc.
const parser = StructuredOutputParser.fromNamesAndDescriptions({
  ratings:
    "a list of keywords rating the comment, e.g. relevant, helpful, kind, rude, spam etc.",
  moderation: "either APPROVED or REJECTED",
  reason:
    "why the comment was approved or rejected, e.g. 'too spammy', 'off topic', 'profane', etc.",
});

const prompt = PromptTemplate.fromTemplate(
  "We have this recipe {recipeSummary}. Can you judge this comment {comment}? \n {formatInstructions}",
);

const chain = RunnableSequence.from([prompt, aiModel, parser]);

const formatInstructions = parser.getFormatInstructions();

export async function rateComment(comment: string, recipeSummary: string) {
  return chain.invoke({
    comment,
    recipeSummary,
    formatInstructions,
  });
}
