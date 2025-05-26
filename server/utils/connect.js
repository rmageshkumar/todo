import mongoose from "mongoose";

const connection = { isConneted: null };

export const connectToDB = async () => {
  try {
    if (connection.isConneted) {
      return;
    }
    const db = await mongoose.connect(process.env.MONGODB_URI);
    connection.isConneted = db.connections[0].readyState;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("DB Connection error", error);
  }
};
