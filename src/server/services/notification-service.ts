import { type PrismaClient } from "@prisma/client";

export async function sendCommentNotification(
  db: PrismaClient,
  commentId: string,
) {
  const comment = await db.comment.findUniqueOrThrow({
    where: { id: commentId },
    select: {
      id: true,
      text: true,
      createdAt: true,
      recipe: { select: { id: true, name: true, createdById: true } },
      user: { select: { id: true, name: true, handle: true } },
    },
  });
  await db.notification.create({
    data: {
      type: "COMMENT",
      userId: comment.recipe.createdById,
      content: {
        recipe: comment.recipe,
        commenter: comment.user,
        text: comment.text,
        createdAt: comment.createdAt,
      },
    },
  });
}

export async function sendReactionNotification(db: PrismaClient, id: number) {
  const reaction = await db.reaction.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      createdAt: true,
      recipe: { select: { id: true, name: true, createdById: true } },
      user: { select: { id: true, name: true, handle: true } },
    },
  });
  await db.notification.create({
    data: {
      type: "REACTION",
      userId: reaction.recipe.createdById,
      content: {
        recipe: reaction.recipe,
        reactor: reaction.user,
        createdAt: reaction.createdAt,
      },
    },
  });
}

export async function sendFollowNotification(
  db: PrismaClient,
  userId: string,
  followerId: string,
) {
  const follower = await db.user.findUniqueOrThrow({
    where: { id: followerId },
    select: { id: true, name: true },
  });
  await db.notification.create({
    data: { type: "FOLLOW", userId, content: { follower } },
  });
}
