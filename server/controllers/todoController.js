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
  const id = req.params.id;
  if (!req.body) return next(createError(404, "Missing field"));
  try {
    await connectToDB();
    const todo = await Todo.findById(id);
    console.log(todo);
    if (req.user.id !== todo.userId.toString())
      return next(createError(403, "You are not authorized"));
    todo.title = req.body.title || todo.title;
    if (req.body.isCompleted !== undefined)
      todo.isCompleted = req.body.isCompleted;
    // todo.completed;
    await todo.save();
    res.status(200).json({ message: "Todo updated successfully", todo: todo });
  } catch (error) {
    next(createError(404, "Todo not found"));
  }
}

export async function getTodo(req, res, next) {
  try {
    await connectToDB();
    const todo = await Todo.findById(req.params.id);
    if (!todo) return next(createError(404, "Todo not found"));
    if (req.user.id !== todo.userId.toString())
      return next(createError(403, "You are not authorized"));

    res.status(200).json(todo);
  } catch (error) {
    next(createError(404, "Todo not found"));
  }
}

export async function deleteTodo(req, res, next) {
  try {
    await connectToDB();
    const todo = await Todo.findById(req.params.id);
    if (!todo) return next(createError(404, "Todo not found"));
    if (req.user.id !== todo.userId.toString())
      return next(createError(403, "You are not authorized"));
    await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    next(createError(404, "Todo not found"));
  }
}
