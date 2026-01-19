const Header = ({ teacherName, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h2>LMS - Learning Management System</h2>
        <div>
          <span style={{ marginRight: "15px" }}>Welcome, {teacherName}</span>
          <button className="btn btn-danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
