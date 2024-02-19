import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { aiModel } from "./ai-service";
import { type User } from "@prisma/client";

type ParserInstructions = typeof parserInstructions;

const parserInstructions = {
  moderation: "either APPROVED or REJECTED",
  reason:
    "why the user was approved or rejected, e.g. 'spammy', 'profane', 'irrelevant', etc.",
};

const parser =
  StructuredOutputParser.fromNamesAndDescriptions(parserInstructions);

const prompt = PromptTemplate.fromTemplate(
  "We have this user {userJson}. Can you review this user? {formatInstructions}",
);

const chain = RunnableSequence.from([prompt, aiModel, parser]);

const formatInstructions = parser.getFormatInstructions();

export async function reviewUser(
  user: Partial<User> & { id: string },
): Promise<ParserInstructions> {
  try {
    const result = await chain.invoke({
      userJson: JSON.stringify(user),
      formatInstructions,
    });
    return result as ParserInstructions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      reason: `error ${e.toString()}`,
      moderation: "REJECTED",
    };
  }
}
