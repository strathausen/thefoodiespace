import dayjs from "dayjs";
import { api } from "@/trpc/server";
import Link from "next/link";

export default async function MyRecipePage() {
  const recipes = await api.recipe.listMine.query({});
  return (
    <div className="mt-10">
      {recipes?.map((r) => {
        return (
          <div key={r.id}>
            <Link href={`/editor/${r.id}`} className="flex">
              <span className="mr-6 text-gray-500">
                {dayjs(r.createdAt).format("YYYY-MM-DD")}
              </span>
              {r.name || r.id}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
