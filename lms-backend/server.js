import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import path from "path";
const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://usman-lms.vercel.app"
  ],
  credentials: true
}))
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// Database
connectDB();

// Routes
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "LMS API is running..." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
