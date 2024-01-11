"use client";
import { api } from "@/trpc/react";
import { useCallback } from "react";

export const useBookmarks = () => {
  const { refetch, isFetched, data } = api.bookmark.list.useQuery({});
  const bookmarkMutation = api.bookmark.create.useMutation();
  const unbookmarkMutation = api.bookmark.remove.useMutation();

  const bookmark = async (recipeId: string) => {
    await bookmarkMutation.mutateAsync({ recipeId });
    await refetch();
  };

  const unbookmark = async (recipeId: string) => {
    await unbookmarkMutation.mutateAsync({ recipeId });
    await refetch();
  };

  const isBookmarked = useCallback(
    (recipeId: string) => {
      return data?.items.some((b) => b.recipe.id === recipeId);
    },
    [data?.items],
  );

  return {
    recipeIds: data?.items.map((f) => f.recipe.id) ?? [],
    bookmarks: data?.items ?? [],
    refetch,
    isFetched,
    bookmark,
    unbookmark,
    isBookmarked,
  };
};
