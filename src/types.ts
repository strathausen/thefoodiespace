// <script type="application/ld+json">
export type Recipe = {
  "@context": "https://schema.org/";
  "@type": "Recipe";
  name: string;
  image: string[];
  author?: {
    "@type": "Person";
    name: string;
  };
  datePublished?: string;
  description?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  keywords?: string;
  recipeYield?: string;
  recipeCategory?: string;
  recipeCuisine?: string;
  nutrition?: {
    "@type": "NutritionInformation";
    calories: string;
  };
  recipeIngredient: string[];
  recipeInstructions: {
    "@type": "HowToStep";
    name: string;
    text: string;
    url: string;
    image?: string;
  }[];
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: string;
    ratingCount: string;
  };
  video?: {
    "@type": "VideoObject";
    name: string;
    description: string;
    thumbnailUrl: string[];
    contentUrl: string;
    embedUrl: string;
    uploadDate: string;
    duration: string;
    interactionStatistic: {
      "@type": "InteractionCounter";
      interactionType: {
        "@type": "WatchAction";
      };
      userInteractionCount: number;
    };
    expires: string;
  };
};

export type RecipeFeedItem = {
  id: number;
  title: string;
  media: { type: "image" | "video"; url: string }[];
  author: {
    name: string;
    avatar: string;
  };
  reactions: {
    type:
      | "like"
      | "love"
      | "haha"
      | "wow"
      | "sad"
      | "angry"
      | "thankful"
      | "cooked"
      | "tried"
      | "saved"
      | "pride";
    count: number;
    liked?: boolean;
  }[];
};

export type RecipeStep = {
  name: string;
  text: string;
  usedIngredients?: string;
};
