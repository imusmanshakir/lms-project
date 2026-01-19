import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

const TeacherLogin = ({ setTeacher }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/api/teachers/login", {
        email,
        password,
      });

      if (response.data.token && response.data.teacherName ) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("teacherName", response.data.teacherName);

        setTeacher({ name: response.data.teacherName });
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid Credentials", err);
      alert("Please enter correct credentials");
    }
  };

  return (
    <div className="auth-container">
      <h2>Teacher Login</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
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
          className="btn btn-primary"
          style={{ width: "100%" }}
        >
          Login
        </button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      <p style={{ textAlign: "center" }}>
        Are you a student?{" "}
        <Link to="/student/login" className="link-btn">
          Student Login
        </Link>
      </p>

      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Not registered?{" "}
        <Link to="/register" className="link-btn">
          Teacher Register
        </Link>
      </p>
    </div>
  );
};

export default TeacherLogin;
