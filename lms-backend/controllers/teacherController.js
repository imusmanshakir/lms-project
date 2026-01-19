import Teacher from "../models/Teacher.js";
import { signToken } from "../utils/jwt.js";

export async function registerTeacher(req, res) {
  try {
    const { name, email, password } = req.body;
    const existing = await Teacher.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Already registered" });

    const teacher = new Teacher({ name, email, password });
    await teacher.save();
    // sign a token
    const token = signToken({ userId: teacher._id, email: teacher.email });

    return res.status(201).json({ message: "Teacher registered", token });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
}

// Login Teacher
export async function loginTeacher(req, res) {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await teacher.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
 const token = signToken({ userId: teacher._id, email: teacher.email });
    res.json({
      message: "Login successful",
      teacherName: teacher.name,
      token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
