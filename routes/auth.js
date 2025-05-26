import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import { loginUser } from "../controllers/authController.js";
import { validateLogin } from "../middlewares/validateUser.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();

const prisma = new PrismaClient();

router.post("/login", validateLogin, loginUser);

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        pictureUrl: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error in /auth/me:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
