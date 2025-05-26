import express from "express";
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  getTodo,
  updateTodo,
} from "../controllers/todoController.js";
import { verifyToken } from "../utils/verify.js";

const router = express.Router();

router.get("/", verifyToken, getAllTodos);

router.post("/", verifyToken, createTodo);

router.put("/:id", verifyToken, updateTodo);

router.get("/:id", verifyToken, getTodo);

router.delete("/:id", verifyToken, deleteTodo);

export default router;
