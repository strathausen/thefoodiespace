import { OpenAI } from "@langchain/openai";
import { env } from "@/env.mjs";

export const aiModel = new OpenAI({
  modelName: "gpt-4-turbo-preview",
  temperature: 0,
  openAIApiKey: env.OPENAI_API_KEY,
});

export const aiImageModel = new OpenAI({
  modelName: "gpt-4-vision-preview",
  temperature: 0,
  openAIApiKey: env.OPENAI_API_KEY,
});
