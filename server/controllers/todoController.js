import { connectToDB } from "../utils/connect.js";
import Todo from "../models/todoModel.js";
import { createError } from "../utils/error.js";

export async function getAllTodos(req, res, next) {
  await connectToDB();
  console.log("Get all todos");
  try {
    const todos = await Todo.find({ userId: req.user.id });
    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
}

export async function createTodo(req, res, next) {
  console.log("Create todo", req.body);
  if (!req.body || !req.body.title) {
    return next(createError(404, "Missing title"));
  }
  await connectToDB();
  const newTodo = new Todo({
    userId: req.user.id,
    title: req.body.title,
    // description: req.body.description,
    // completed: req.body.completed,
  });

  await newTodo.save();
  res.status(201).json(newTodo);
}

export async function updateTodo(req, res, next) {
  console.log("Update todo");
  res.send(req.params.id);
}

export async function getTodo(req, res, next) {
  connectToDB();
  const todo = await Todo.findById(req.params.id);
  if (!todo) return next(createError(404, "Todo not found"));
  if (req.user.id !== todo.userId.toString())
    return next(createError(403, "You are not authorized"));

  res.status(200).json(todo);
}

export async function deleteTodo(req, res, next) {
  console.log(req.params.id);
  res.send(`delete todo with id: ${req.params.id}`);
}
