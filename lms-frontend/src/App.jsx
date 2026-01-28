import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TeacherLogin from "./components/Auth/TeacherLogin";
import Register from "./components/Auth/Register";
import StudentForm from "./components/Student/StudentForm";
import StudentList from "./components/Student/StudentList";
import Header from "./components/Layout/Header";
import StudentLogin from "./components/Student/StudentLogin";
import StudentDashboard from "./components/Student/StudentDashboard";


function App() {
  const [teacher, setTeacher] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const teacherName = localStorage.getItem("teacherName");
    if (token && teacherName) {
      setTeacher({ name: teacherName });
    }
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("teacherName");
    setTeacher(null);
  };

  return (

    <BrowserRouter>
      {teacher && <Header teacherName={teacher.name} onLogout={handleLogout} />}
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              teacher ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/login"
            element={<TeacherLogin setTeacher={setTeacher} />}
          />
          <Route
            path="/register"
            element={<Register setTeacher={setTeacher} />}
          />

          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route
            path="/dashboard"
            element={
              teacher ? (
                <>
                  <StudentForm />
                  <StudentList />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/student/login" element={<StudentLogin />} />

          <Route
            path="/student/dashboard"
            element={
              localStorage.getItem("role") === "student" ? (
                <StudentDashboard />
              ) : (
                <Navigate to="/student/login" />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
