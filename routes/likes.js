import express from "express";
import { likePost, unlikePost } from "../controllers/likeController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, likePost);
router.delete("/:postId", verifyToken, unlikePost);

export default router;
