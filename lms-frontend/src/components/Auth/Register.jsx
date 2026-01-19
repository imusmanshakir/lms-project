import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
import api from "../../services/api";

const Register = ({ setTeacher }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/api/teachers/register", {
        name,
        email,
        password,
      });

      // If backend auto-logs in on register and returns token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("teacherName", name);
        setTeacher({ id: response.data.teacherId, name });
        navigate("/dashboard");
      } else if (response.data.message?.includes("already registered")) {
        setError(response.data.message);
        setTimeout(() => navigate("/login"), 2000);
      } else if (response.data.teacherId) {
        // if backend doesn't return token
        localStorage.setItem("teacherId", response.data.teacherId);
        localStorage.setItem("teacherName", name);
        setTeacher({ id: response.data.teacherId, name });
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Teacher Registration</h2>
      {error && (
        <div
          className={
            error.includes("already") ? "success-message" : "error-message"
          }
        >
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter email"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password"
          />
        </div>
        <button
          type="submit"
          className="btn btn-success"
          style={{ width: "100%" }}
        >
          Register
        </button>
        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Already registered?{" "}
          <Link to="/login" className="link-btn">
            Login here
          </Link>
        </p>
        
      </form>
      
    </div>

    
  );
};

export default Register;
