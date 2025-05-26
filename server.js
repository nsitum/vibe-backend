import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import likeRoutes from "./routes/likes.js";
import commentRoutes from "./routes/comments.js";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const prisma = new PrismaClient();

app.use(express.json());
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/likes", likeRoutes);
app.use("/comments", commentRoutes);

const port = process.env.PORT || 5000;

app.get("/api", (req, res) => {
  res.send("Hello from backend!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
