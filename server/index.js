import express from "express";
import AuthRoute from "./routes/auth.js";
import TodoRoute from "./routes/todo.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/user", AuthRoute);
app.use("/api/todos", TodoRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    error: message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
