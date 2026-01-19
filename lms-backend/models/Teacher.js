import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
//  pre-save hook
teacherSchema.pre("save", async function () {
  if (!this.isModified("password")) return;//if password is not modified, skip hashing
  this.password = await bcrypt.hash(this.password,10);
});

teacherSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Prevent model overwrite error
export default mongoose.models.Teacher ||
  mongoose.model("Teacher", teacherSchema);
