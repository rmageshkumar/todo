import { createError } from "../utils/error.js";
import { connectToDB } from "../utils/connect.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function register(req, res, next) {
  const data = req.body;
  console.log("Signup", data);
  if (!data?.email || !data?.password) {
    console.log("Missing email or password");
    return next(createError(400, "Missing email or password"));
  }

  try {
    await connectToDB();
    const alreadyExists = await User.findOne({ email: data.email });
    if (alreadyExists) {
      return next(createError(400, "User already exists"));
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);
    const newUser = new User({ ...req.body, password: hash });
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (err) {
    return next(createError(400, "User not created"));
  }
}

export async function login(req, res, next) {
  const data = req.body;
  if (!data?.email || !data?.password) {
    console.log("Missing email or password");
    return next(createError(400, "Missing email or password"));
  }

  await connectToDB();
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(createError(404, "User not found"));

  const isCorrect = await bcrypt.compare(req.body.password, user.password);
  if (!isCorrect) return next(createError(400, "Wrong credentials"));

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  console.log(token);
  // res.send("login");
  res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json("Logged in successfully");
}

export async function logout(req, res, next) {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}
