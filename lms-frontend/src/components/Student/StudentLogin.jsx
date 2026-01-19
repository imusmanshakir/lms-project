import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/students/login", {
        email,
        password,
      });

      if (res.data.token ) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", "student");

        navigate("/student/dashboard");
      } 
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-container">
      <h2>Student Login</h2>

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

        <button className="btn btn-primary" style={{ width: "100%" }}>
          Login
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Are you a teacher?{" "}
        <Link to="/login" className="link-btn">
          Teacher Login
        </Link>
      </p>
    </div>
  );
};

export default StudentLogin;
