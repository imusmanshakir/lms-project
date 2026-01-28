import mongoose from "mongoose";
// import cronTask from "../utils/hardDeleteStudents.js"

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas Connected Successfully");
    // cronTask.start();
    // console.log("cros-job started");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  };
};

export default connectDB;
