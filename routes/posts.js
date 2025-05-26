import express from "express";
import {
  createPost,
  getAllPosts,
  editPost,
  deletePost,
} from "../controllers/postController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllPosts);
router.post("/", verifyToken, createPost);
router.put("/:id", verifyToken, editPost);
router.delete("/:id", verifyToken, deletePost);

export default router;
