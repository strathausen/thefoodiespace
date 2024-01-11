"use client";
import { api } from "@/trpc/react";

export const useFollowings = () => {
  const { refetch, isFetched, data } = api.follow.myFollowees.useQuery({});
  const followMutation = api.follow.follow.useMutation();
  const unfollowMutation = api.follow.unfollow.useMutation();

  const follow = async (id: string) => {
    await followMutation.mutateAsync({ id });
    await refetch();
  };

  const unfollow = async (id: string) => {
    await unfollowMutation.mutateAsync({ id });
    await refetch();
  };

  return {
    ids: data?.items.map((f) => f.followee.id) ?? [],
    followings: data?.items ?? [],
    refetch,
    isFetched,
    follow,
    unfollow,
  };
};
