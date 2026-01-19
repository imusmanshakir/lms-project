import { useEffect, useState } from "react";
import api from "../../services/api";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    api.get("/api/students/me").then((res) => {
      setStudent(res.data);
    });
  }, []);

  if (!student) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>My Profile</h2>

      <img
        src={`http://localhost:5000${student.profileImage}`}
        alt="profile"
        width="150"
        style={{ borderRadius: "8px" }}
      />

      <p><b>Name:</b> {student.name}</p>
      <p><b>Email:</b> {student.email}</p>
      <p><b>Age:</b> {student.age}</p>
      <p><b>Department:</b> {student.department}</p>
      <p><b>Degree:</b> {student.degree}</p>
      <hr />

      <h4>Teacher Info</h4>
      <p><b>Name:</b> {student.teacherId?.name}</p>
      <p><b>Email:</b> {student.teacherId?.email}</p>
    </div>
  );
};

export default StudentDashboard;
