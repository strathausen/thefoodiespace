import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { aiModel } from "./ai-service";

type ParserInstructions = typeof parserInstructions;

const parserInstructions = {
  ratings:
    "a list of keywords rating the comment, e.g. relevant, helpful, kind, rude, spam etc.",
  moderation: "either APPROVED or REJECTED",
  reason:
    "why the comment was approved or rejected, e.g. 'too spammy', 'profane', etc.",
};

const parser =
  StructuredOutputParser.fromNamesAndDescriptions(parserInstructions);

const prompt = PromptTemplate.fromTemplate(
  `Can you rate this comment "{comment}" by "{commenter}"? \n {formatInstructions}`,
);

const chain = RunnableSequence.from([prompt, aiModel, parser]);

const formatInstructions = parser.getFormatInstructions();

export async function reviewComment(
  commenter: string,
  comment: string,
): Promise<ParserInstructions> {
  const result = await chain.invoke({
    comment: comment.replaceAll('"', " "),
    commenter: commenter.replaceAll('"', " "),
    formatInstructions,
  });
  return result as ParserInstructions;
}
