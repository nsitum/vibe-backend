import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const likePost = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.body;

  try {
    const like = await prisma.like.create({
      data: { userId, postId },
    });

    res.status(201).json(like);
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ error: "Failed to like post" });
  }
};

export const unlikePost = async (req, res) => {
  const postId = parseInt(req.params.postId);

  console.log(postId);
  if (!postId || isNaN(postId)) {
    return res.status(400).json({ error: "Invalid or missing postId." });
  }

  try {
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: req.user.id,
          postId,
        },
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Unlike error:", error);
    res.status(500).json({ error: "Failed to unlike post" });
  }
};
