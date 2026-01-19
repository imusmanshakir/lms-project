// routes/studentRoutes.js
import { Router } from "express";
import { addStudent, getAllStudents,loginStudent,getMyProfile, updateStudent, softDeleteStudent } from "../controllers/studentController.js";
import authJwt from "../middlware/authJwt.js";
import { uploadStudentImage } from "../middlware/upload.js";
// import {allowRoles} from "../middlware/roleCheck.js"

const router = Router();

router.post("/add", authJwt,uploadStudentImage.single("profileImage"), addStudent);
router.get("/me", authJwt, getMyProfile);
router.get("/all", authJwt, getAllStudents);
router.post("/login", loginStudent);
router.put("/:id", authJwt, uploadStudentImage.single("profileImage"), updateStudent);
router.delete("/:id",authJwt,  softDeleteStudent);

export default router;
