import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createComment = async (req, res) => {
  const { content, postId } = req.body;

  if (!content || !postId) {
    return res.status(400).json({ error: "Missing content or postId" });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId: req.user.id,
      },
      include: {
        user: {
          select: { id: true, username: true, pictureUrl: true },
        },
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
};

export const getCommentsByPost = async (req, res) => {
  const postId = Number(req.params.postId);

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: { id: true, username: true, pictureUrl: true },
        },
      },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};
