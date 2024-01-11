"use client";
import { api } from "@/trpc/react";
import { useI18n } from "locales/client";
import { useState } from "react";
import { FaRegPaperPlane, FaTrash } from "react-icons/fa6";

type Props = {
  recipeId: string;
  myComments: { text: string; id: string; temporary?: boolean }[];
};

export const RecipeCommentField = (props: Props) => {
  const t = useI18n();
  const [myComments, setMyComments] = useState(props.myComments);
  const [comment, setComment] = useState("");
  const createComment = api.comment.addComment.useMutation();
  const deleteComment = api.comment.deleteComment.useMutation();
  const allComments = api.comment.listComments.useQuery(
    {
      recipeId: props.recipeId,
    },
    { enabled: false },
  );

  async function onCommentSubmit() {
    const text = comment.trim();
    setMyComments((c) => [{ text, id: "temp", temporary: true }, ...c]);
    setComment("");
    try {
      const newComment = await createComment.mutateAsync({
        recipeId: props.recipeId,
        text: comment,
      });
      setMyComments((c) => c.map((c) => (c.id === "temp" ? newComment : c)));
    } catch (e) {
      setMyComments((c) => c.filter((c) => c.id !== "temp"));
      setComment(text);
    }
  }

  async function onDeleteComment(id: string) {
    setMyComments((c) => c.filter((c) => c.id !== id));
    await deleteComment.mutateAsync(id);
  }

  return (
    <div className="flex w-fit flex-col px-1 text-sm max-w-[400px]">
      <div className="flex w-full flex-col">
        {myComments.map((c) => {
          return (
            <div key={c.id} className="group flex justify-between">
              <p
                className={`${
                  c.temporary ? "text-stone-600/40" : "text-slate-600/90"
                }`}
              >
                <span className="font-bold">{t("you")}: </span>
                {c.text}
              </p>
              <button
                className="hidden text-xs text-stone-600/40 group-hover:block"
                onClick={async (e) => {
                  e.preventDefault();
                  await onDeleteComment(c.id);
                }}
              >
                <FaTrash />
              </button>
            </div>
          );
        })}
      </div>
      <form
        className="flex w-full"
        onSubmit={async (e) => {
          e.preventDefault();
          await onCommentSubmit();
        }}
      >
        <input
          className="-m-1 flex-1 bg-transparent px-1 py-2 placeholder:text-green-950/40"
          placeholder="leave a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={createComment.isLoading}
        />
        <button className="text-slate-600/40" type="submit">
          <FaRegPaperPlane />
        </button>
      </form>
    </div>
  );
};
