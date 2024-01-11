"use client";
import { api } from "@/trpc/react";
import { create } from "zustand";

export const useStore = create((set) => ({
  // books: [],
  // setBooks: (books) => set({ books }),
  followings: [] as number[],
  async fetchFollowings() {
    const query = api.follow.myFollowees.useQuery({});
    set({ followings: query.items.map((f) => f.followee.id) });
  },
}));
