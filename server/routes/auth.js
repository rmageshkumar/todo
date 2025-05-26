import express from "express";
import { login, logout, register } from "../controllers/authController.js";

const router = express.Router();
// router.post("/login", (req, res, next) => {
//   res.send("Login router");
// });

// router.post("/signup", (req, res, next) => {
//   res.send("Signup router");
// });

// router.post("/logout", (req, res, next) => {
//   res.send("Logout router");
// });

router.post("/signup", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
