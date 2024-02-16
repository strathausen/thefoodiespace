import { env } from "@/env.mjs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// transcribe and review images TODO
export async function transcribeImage(imageUrl: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      max_tokens: 150,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Write an alt text for this image please!" },
            { type: "image_url", image_url: { url: imageUrl, detail: "low" } },
          ],
        },
      ],
    });
    const text =
      response.choices[0]?.message.content?.replace(/^Alt text[: ]*/i, "") ??
      "no alt text could be generated"; // TODO handle this better, does it even happen?
    return { text };
  } catch (e) {
    if (e instanceof Error) {
      return {
        text: e.message,
        error: true,
      };
    } else if (e instanceof OpenAI.APIError) {
      return {
        text: e.code, // code === content_policy_violation for inappropriate content
        error: true,
      };
    }
  }
  return {
    text: "no response",
    error: true,
  };
}

// console.log(
//   await transcribeImage(
//     // "https://utfs.io/f/0fc94118-3dde-4646-8d2d-e3116c18967a-1xbw1l.jpeg")
//     // "https://www.thefoodie.space/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F5653ec25-885a-45a1-8695-cb8c36a53940-sy8tg4.png&w=256&q=75",
//     // "https://www.thefoodie.space/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2Fa8cbfd8b-020e-423f-824b-6d422ad2b1c7-ru1umz.jpg&w=640&q=75",
//     // "https://www.thefoodie.space/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F08ac1853-1480-4eb7-b25a-3be11917b050-1xbbbx.jpeg&w=640&q=75"
//     // "https://www.thefoodie.space/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F5ea83e32-efff-4ea1-9820-9acd5ad1aaca-1x9c0w.jpeg&w=640&q=75"
//     "https://www.thefoodie.space/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F86aa47b7-149e-4068-97e3-d92e46f6ba52-1xbtso.jpeg&w=640&q=75"
//   ),
// );
