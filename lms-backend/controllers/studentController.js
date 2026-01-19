import Student from "../models/Student.js";
import { sendWelcomeEmail } from "../utils/mailer.js";
import { signToken } from "../utils/jwt.js";

export async function addStudent(req, res) {
  try {
    const { name, email, password, age, department, degree } = req.body;
    // const existing = await Student.findOne({ email });
    // if (existing) {
    //   return res.status(400).json({ message: "Student Already Registrerd" });
    // }

    // userId from token:
    const teacherId = req.userId; // set by authJwt
    const profileImage = req.file
      ? `/uploads/students/${req.file.filename}`
      : null;

    if (!name || !email || !department || !age || !degree || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // keep teacher relation
    const student = new Student({ name,email, password, age, department, degree, profileImage, teacherId, });
    await student.save();

    try {
      const info = await sendWelcomeEmail(name, email, password, department, degree);
    } catch (mailErr) {
      console.error("Mail send failed:", mailErr); // do not fail the registration — log the mail error
    }

    res.status(201).json({ message: "Student added successfully", student });
  } catch (error) {
    console.error("addStudent error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function loginStudent(req, res) {
  const { email, password } = req.body;

  const student = await Student.findOne({ email });
  if (!student) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await student.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = signToken({ userId: student._id, role: "student",});

  res.json({token,studentName: student.name,role: "student",});
}

export async function getAllStudents(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;

    const skip = (page - 1) * limit;
    // only non-deleted students
    const filter = { isDeleted: false}; // optional per-teacher scope

    const totalStudents = await Student.countDocuments(filter);
    const students = await Student.find(filter).skip(skip).limit(limit);

    res.json({ students, totalStudents, totalPages: Math.ceil(totalStudents / limit), currentPage: page,});
  } catch (error) {
    console.error("getAllStudents error:", error);
    res.status(500).json({message: "Server error",error: error.message});
  }
}

export async function getMyProfile(req, res) {
  try {
    const student = await Student.findById(req.userId).populate( "teacherId", "name email" );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateStudent(req, res) {
  try {
    const { id } = req.params;
    const { name, email, age, department, degree } = req.body;
    const update = { name, email, age, department, degree };
    if (req.file) {
      update.profileImage = `/uploads/students/${req.file.filename}`;
    }
    //only allow the teacher who owns the student to update
    const student = await Student.findOne({ _id: id, teacherId: req.userId });
    if (!student) return res.status(404).json({ message: "Student not found" });

    Object.assign(student, update);
    await student.save();
    res.json({ message: "Student Updated", student });
  } catch (error) {
    console.error("updateStudent error", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

export async function softDeleteStudent(req, res) {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.isDeleted = true;
    await student.save();

    res.json({ message: "Student soft deleted successfully" });
  } catch (error) {
    console.error("softDeleteStudent error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
