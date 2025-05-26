import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

const DEFAULT_PICTURE_URL = "https://i.ibb.co/PZc8hcgv/defaultimage.jpg";

export const createUser = async (req, res) => {
  const { email, username, password, pictureUrl, postsLiked } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const pictureUrlToSave =
      pictureUrl && pictureUrl.trim() !== "" ? pictureUrl : DEFAULT_PICTURE_URL;

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        pictureUrl: pictureUrlToSave,
        postsLiked,
      },
    });

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        pictureUrl: newUser.pictureUrl,
      },
      token,
    });
  } catch (error) {
    console.error("Error while registering:", err);
    res.status(500).json({ error: "Something went wrong while registering" });
  }
};

export const updateUser = async (req, res) => {
  const { username, email, password, pictureUrl, oldPassword } = req.body;

  if (!username && !email && !password && !pictureUrl) {
    return res.status(400).json({ error: "No fields to update." });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (oldPassword) {
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return res.status(403).json({ error: "Incorrect old password" });
    }
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(username && { username }),
        ...(email && { email }),
        ...(password && { password: await bcrypt.hash(password, 10) }),
        ...(pictureUrl && { pictureUrl }),
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user." });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
