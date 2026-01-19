import { Router } from "express";
import { registerTeacher, loginTeacher,} from "../controllers/teacherController.js";
import authJwt from "../middlware/authJwt.js";
const router = Router();

router.post("/register",authJwt, registerTeacher);
router.post("/login", loginTeacher);

export default router;
