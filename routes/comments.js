import express from "express";
import {
  createComment,
  getCommentsByPost,
} from "../controllers/commentController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createComment);
router.get("/:postId", getCommentsByPost);

export default router;
