import { OpenAI as LangchainOpenAi } from "@langchain/openai";
import { env } from "@/env.mjs";

export const aiModel = new LangchainOpenAi({
  modelName: "gpt-4-turbo-preview",
  temperature: 0,
  openAIApiKey: env.OPENAI_API_KEY,
});
