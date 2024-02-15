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
    const altTexts = await Promise.all(
      newImages.map(async (image) => {
        return {
          alt: await transcribeImage(image),
          url: image,
        };
      }),
    );
    // const badImages = altTexts.filter((t) => t.alt.error).map((t) => t.url);
    const goodImages = altTexts.filter((t) => !t.alt.error);
    const hasErrors = altTexts.some((t) => t.alt.error);

    //  remove bad images, add good images
    // const images = [
    //   ...new Set([...recipe.images, ...goodImages.map((t) => t.url)]),
    // ].filter((i) => !badImages.includes(i));
    // const steps = recipe.steps.map((s) => ({
    //   ...s,
    //   images: s.images
    //     ? [...s.images].filter((i) => !badImages.includes(i))
    //     : [],
    // }));
    // save alt texts and updated image sets
    await db.recipe.update({
      where: { id: recipeId },
      data: {
        // TODO for now, we want to avoid overwriting the images and steps in case they are updated in the meantime
        // images,
        // steps,
        moderation: hasErrors ? "PENDING" : recipe.moderation,
        altImages: {
          ...altImages,
          ...Object.fromEntries(goodImages.map((t) => [t.url, t.alt.text!])),
        },
      },
    });
    return { event, body: "Hello, World!" };
  },
);
