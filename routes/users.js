import express from "express";
import {
  createUser,
  getAllUsers,
  updateUser,
} from "../controllers/userController.js";
import { validateRegistration } from "../middlewares/validateUser.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", validateRegistration, createUser);
router.put("/me", verifyToken, updateUser);
router.get("/", verifyToken, getAllUsers);

export default router;
