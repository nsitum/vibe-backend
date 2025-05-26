import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPost = async (req, res) => {
  const { content } = req.body;

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        userId: req.user.id,
        createdAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            pictureUrl: true,
          },
        },
        likes: true,
      },
    });

    const likesCount = newPost.likes.length;
    const isLiked = newPost.likes.some((like) => like.userId === req.user.id);

    res.status(201).json({
      ...newPost,
      likesCount,
      isLiked,
    });
  } catch (error) {
    console.error("Error while posting:", error);
    res.status(500).json({ error: "Something went wrong while posting" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            pictureUrl: true,
          },
        },
        likes: true,
      },
    });

    const formattedPosts = posts.map((post) => {
      const likesCount = post.likes.length;
      const isLiked = post.likes.some((like) => like.userId === req.user?.id);
      return {
        ...post,
        likesCount,
        isLiked,
      };
    });

    res.status(200).json(formattedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res
      .status(500)
      .json({ error: "Something went wrong while fetching posts" });
  }
};

export const editPost = async (req, res) => {
  const postId = parseInt(req.params.id);
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Post content is required" });
  }

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (existingPost.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not allowed to edit this post" });
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            pictureUrl: true,
          },
        },
        likes: true,
      },
    });

    const likesCount = updatedPost.likes.length;
    const isLiked = updatedPost.likes.some(
      (like) => like.userId === req.user.id
    );

    res.status(200).json({ ...updatedPost, likesCount, isLiked });
  } catch (error) {
    console.error("Error editing post:", error);
    res.status(500).json({ error: "Failed to edit post." });
  }
};

export const deletePost = async (req, res) => {
  const postId = parseInt(req.params.id);

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (existingPost.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not allowed to delete this post" });
    }

    const deletedPost = await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    res.status(200).json(deletedPost);
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post." });
  }
};
