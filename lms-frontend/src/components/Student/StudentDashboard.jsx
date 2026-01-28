import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../../css/studentDash.css";
import Header from "../Layout/Header";

export default function Main() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    let mounted = true;
    async function fetchStudent() {
      try {
        setLoading(true);
        const res = await api.get("/api/students/me");
        if (mounted) setStudent(res.data);
      } catch (err) {
        console.error(err);
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (token && role) {
      fetchStudent();
    } else if (error) {
      setError(error)
    }

    return () => (mounted = false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
  };

  if (loading) {
    return (
      <div className="student-profile-container">
        <div className="skeleton-container">
          <div className="skeleton-pulse">
            <div className="skeleton-image" />
          </div>
          <div className="skeleton-content">
            <div className="skeleton-bar skeleton-bar-1" />
            <div className="skeleton-bar skeleton-bar-2" />
            <div className="skeleton-bar skeleton-bar-3" />
            <div className="skeleton-bar skeleton-bar-4" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-profile-container">
        <div className="error-container">
          Failed to load profile. Please refresh or try again later.
        </div>
      </div>
    );
  }

  const profileSrc = student?.profileImage
    ? `http://localhost:5000uploads/students/1769086942229-409607342.png/`
    : "https://www.gravatar.com/avatar?d=mp&s=200";

  return (
    <div className="student-profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        <div className="header-buttons">
          <button
            className="btn"
            onClick={() => alert("Open edit profile modal (implement)")}
          >
            Edit Profile
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="profile-grid">
        {/* Profile card */}
        <div className="profile-card">
          <img
            src={profileSrc}
            alt={`${student.name || "Student"} profile`}
            className="profile-image"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = profileSrc;
            }}
          />

          <div className="profile-info">
            <h3>{student.name}</h3>
            <p>{student.email}</p>
          </div>

          <div className="profile-meta">
            <div className="profile-meta-row">
              <div className="profile-meta-item">
                <div className="profile-meta-label">Department</div>
                <div className="profile-meta-value">{student.department || "—"}</div>
              </div>
              <div className="profile-meta-item-right">
                <div className="profile-meta-label">Degree</div>
                <div className="profile-meta-value">{student.degree || "—"}</div>
              </div>
            </div>

            <div className="profile-tags">
              <span className="profile-tag">Age: {student.age ?? "—"}</span>
              <span className="profile-tag">ID: {student._id?.slice(-6) ?? "—"}</span>
            </div>
          </div>
        </div>

        {/* Main details */}
        <div className="profile-main">
          <div className="card">
            <h4>Details</h4>

            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-label">Full name</div>
                <div className="detail-value">{student.name}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Email</div>
                <div className="detail-value-truncate">{student.email}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Age</div>
                <div className="detail-value">{student.age ?? "—"}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Department</div>
                <div className="detail-value">{student.department ?? "—"}</div>
              </div>

              <div className="detail-item detail-item-full">
                <div className="detail-label">About</div>
                <div className="detail-bio">
                  {student.bio || "No bio provided — add a short intro about yourself."}
                </div>
              </div>
            </div>
          </div>

          <div className="card teacher-card">
            <div className="teacher-info">
              <h4>Teacher</h4>
              <p className="teacher-name">{student.teacherId?.name || "Not assigned"}</p>
              <p className="teacher-email">{student.teacherId?.email || "—"}</p>
            </div>

            <div className="teacher-actions">
              <button
                className="btn"
                onClick={() => alert("Message teacher (implement)")}
              >
                Message
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => alert("View teacher profile (implement)")}
              >
                View Profile
              </button>
            </div>
          </div>

          <div className="profile-footer">
            Last updated: {new Date(student.updatedAt || Date.now()).toLocaleString()}
          </div>
        </div>
      </div>


    </div>
  );
}