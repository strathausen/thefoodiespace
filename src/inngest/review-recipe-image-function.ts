import { inngest } from "./client";
import { db } from "@/server/db";
import { transcribeImage } from "@/server/services/ai-image-review";

export const reviewRecipeImage = inngest.createFunction(
  { id: "recipe-image-function" },
  { event: "recipe/updated" },
  async ({ event }) => {
    // check all images and see if they are appropriate
    // save alt texts in alt
    const { recipeId } = event.data as { recipeId: string };
    const recipe = await db.recipe.findUniqueOrThrow({
      where: { id: recipeId },
      select: {
        id: true,
        images: true,
        steps: true,
        altImages: true,
        moderation: true,
      },
    });
    const imageUrls = [
      ...new Set(
        [...recipe.images, ...recipe.steps.map((s) => s.images).flat()].filter(
          Boolean,
        ) as string[],
      ),
    ];
    // only consider alt texts for images that are still in imageUrls
    const altImages = Object.fromEntries(
      Object.entries(recipe.altImages ?? {}).filter(([url]) =>
        imageUrls.includes(url),
      ),
    );
    // find all images that aren't in altImages yet
    const newImages = altImages
      ? imageUrls.filter((i) => !altImages[i])
      : imageUrls;
    if (newImages.length === 0) {
      return { event, body: "no new images" };
    }
    const altTexts = await Promise.all(
      newImages.map(async (image) => {
        return {
          alt: await transcribeImage(image),
          url: image,
        };
      }),
    );
    const goodImages = altTexts.filter((t) => !t.alt.error);
    const hasErrors = altTexts.some((t) => t.alt.error);
    await db.recipe.update({
      where: { id: recipeId },
      data: {
        ...(hasErrors ? { moderation: "REJECTED" } : {}),
        altImages: {
          ...altImages,
          ...Object.fromEntries(goodImages.map((t) => [t.url, t.alt.text!])),
        },
      },
    });
    return { event, body: `new images processed: ${newImages.join(", ")}` };
  },
);
