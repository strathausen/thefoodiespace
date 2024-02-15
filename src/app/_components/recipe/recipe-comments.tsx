"use client";
import { api } from "@/trpc/react";
import { useI18n } from "locales/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaRegPaperPlane, FaTrash } from "react-icons/fa6";

type Props = {
  recipeId: string;
  commentCount?: number;
  comments: {
    text: string;
    id: string;
    temporary?: boolean;
    user?: { id: string; name?: string | null };
  }[];
};

const isMine = (userId?: string) => (c: { user?: { id?: string | null } }) =>
  !userId || !c.user || c.user?.id === userId;

export const RecipeComments = (props: Props) => {
  const t = useI18n();
  const session = useSession();
  const [comments, setComments] = useState(props.comments);
  const [showAllComments, setShowAllComments] = useState(false);
  const [comment, setComment] = useState("");
  const [commentCount, setCommentCount] = useState(props.commentCount);
  const createComment = api.comment.addComment.useMutation();
  const deleteComment = api.comment.deleteComment.useMutation();
  const allComments = api.comment.listComments.useQuery(
    { recipeId: props.recipeId },
    { enabled: false },
  );

  useEffect(() => {
    if (allComments.data) {
      setComments(allComments.data);
      setCommentCount(allComments.data.length);
    }
  }, [allComments.data]);

  if (!session.data) return null;

  const { user } = session.data;

  async function onCommentSubmit() {
    if (!comment.trim() || !user) {
      return;
    }
    const text = comment.trim();
    setComments((c) => [{ text, id: "temp", temporary: true, user }, ...c]);
    setComment("");
    setCommentCount((c) => (c === undefined ? undefined : c + 1));
    try {
      const newComment = await createComment.mutateAsync({
        recipeId: props.recipeId,
        text: comment,
      });
      setComments((c) =>
        c.map((c) => (c.id === "temp" ? { ...newComment, user } : c)),
      );
    } catch (e) {
      setCommentCount((c) => (c === undefined ? undefined : c - 1));
      setComments((c) => c.filter((c) => c.id !== "temp"));
      setComment(text);
    }
  }

  async function onDeleteComment(id: string) {
    setComments((c) => c.filter((c) => c.id !== id));
    setCommentCount((c) => (c === undefined ? undefined : c - 1));
    await deleteComment.mutateAsync(id);
  }

  const hasComments =
    commentCount === undefined ||
    commentCount - comments.filter(isMine(session.data?.user.id)).length > 0;

  return (
    <div className="flex w-full max-w-[400px] flex-col px-1 text-sm">
      {hasComments &&
        (showAllComments ? (
          <button onClick={() => setShowAllComments(false)}>
            hide comments
          </button>
        ) : (
          <button
            className="text-slate-600/40"
            onClick={async () => {
              await allComments.refetch();
              setShowAllComments(true);
            }}
          >
            {commentCount === undefined ? (
              <span>load comments</span>
            ) : (
              <span>
                show {commentCount} comment
                {commentCount === 1 ? "" : "s"}
              </span>
            )}
          </button>
        ))}
      <div className="flex w-full flex-col">
        {(showAllComments
          ? comments
          : comments.filter(isMine(session.data?.user.id))
        )
          .map((c) => ({ ...c, user: c.user ?? session.data?.user }))
          ?.map((c) => {
            return (
              <div key={c.id} className="group flex justify-between">
                <p className="text-slate-600/90">
                  <span className="font-bold">
                    {c.user?.id === session.data?.user?.id
                      ? t("you")
                      : c.user?.name}
                    :{" "}
                  </span>
                  {c.text}
                </p>
                {c.user?.id === session.data?.user?.id && (
                  <button
                    className="hidden text-xs text-stone-600/40 group-hover:block"
                    onClick={async (e) => {
                      e.preventDefault();
                      await onDeleteComment(c.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                )}
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
