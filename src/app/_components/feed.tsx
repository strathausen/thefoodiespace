import { api } from "@/trpc/server";
import { FeedItem } from "./feed-item";

export async function Feed() {
  const feed = await api.recipe.list.query();
  return (
    <div className="container">
      <div className="flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="flex flex-col items-center gap-2"></div>
        <div className="container">
          {feed.map((recipe) => (
            // <FeedItem key={recipe.id} item={recipe} />
            <div key={recipe.id}>
              <h1>{recipe.name}</h1>
              {/* <p>{recipe.}</p> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
