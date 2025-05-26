import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Must provide email"],
    unique: [true, "Email already exists"],
  },
  password: {
    type: String,
    required: [true, "Must provide password"],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
