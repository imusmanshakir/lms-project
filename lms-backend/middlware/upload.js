import multer from "multer";
import path from "path";
// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/students"); // folder
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// file filter (only images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

export const uploadStudentImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

//if you prefre to use cloudinary storage uncomment below code and comment above code
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "../utils/cloudinary.js";

// const studentStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "lms/students",   // Cloudinary folder
//     allowed_formats: ["jpg", "png", "jpeg", "webp"],
//     public_id: (req, file) => {
//       return `student_${Date.now()}`;
//     },
//   },
// });

// export const uploadStudentImage = multer({
//   storage: studentStorage,
// });

