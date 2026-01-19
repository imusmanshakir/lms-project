import { useState, useEffect, useRef } from "react";
import api from "../../services/api";

const StudentForm = ({ studentToEdit = null, onSaved = () => {} }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [department, setDepartment] = useState("");
  const [degree, setDegree] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [success, setSuccess] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    if (studentToEdit) {
      setName(studentToEdit.name || "");
      setEmail(studentToEdit.email || "");
      setAge(studentToEdit.age || "");
      setDepartment(studentToEdit.department || "");
      setDegree(studentToEdit.degree || "");
      setPassword("");
      setProfileImage(null);
      if (fileRef.current) fileRef.current.value = "";
    } else {
      resetForm();
    }
  }, [studentToEdit]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setAge("");
    setDepartment("");
    setDegree("");
    setPassword("");
    setProfileImage(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  //  SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("age", age);
      formData.append("department", department);
      formData.append("degree", degree);

      // only send password if creating OR teacher typed one
      if (!studentToEdit || password) {
        formData.append("password", password);
      }

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      if (studentToEdit && studentToEdit._id) {
        // UPDATE
        await api.put(`/api/students/${studentToEdit._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Student updated successfully!");
      } else {
        // CREATE
        await api.post("/api/students/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Student added successfully!");
        resetForm();
      }

      onSaved();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Student save error:", err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  //  UI

  return (
    <div className="student-section">
      <h3>{studentToEdit ? "Update Student" : "Add New Student"}</h3>

      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Student Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Student Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>
            Password {studentToEdit && ("")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!studentToEdit}
          />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <input
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Degree</label>
          <input
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            required
          />
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => setProfileImage(e.target.files[0])}
        />

        <button type="submit" className="btn btn-primary">
          {studentToEdit ? "Update Student" : "Add Student"}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
