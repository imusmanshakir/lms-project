import { useState, useEffect } from "react";
import api from "../../services/api";
import StudentForm from "./StudentForm";
const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null); // student object for edit
  const [showForm, setShowForm] = useState(false);

  const fetchStudents = async (pageNumber = 1) => {
    try {
      const res = await api.get(`/api/students/all?page=${pageNumber}&limit=4`);

      setStudents(res.data.students);
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  const handleEdit = async (student) => {
    setEditingStudent(student);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSaved = () => {
    // after add/update, hide form and refresh list
    setShowForm(false);
    setEditingStudent(null);
    fetchStudents(1); // go to first page optionally, or keep current page
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this student?");
    if (!ok) return;
    try {
      await api.delete(`/api/students/${id}`);
      fetchStudents(page);
    } catch (error) {
      console.error("Delete failed", error);
      alert("Delete Failed");
    }
  };

  return (
    <div className="student-section">
      <h3>All Students</h3>


      {showForm && (
        <StudentForm studentToEdit={editingStudent} onSaved={onSaved} />
      )}

      <button
        className="btn btn-primary"
        style={{ margin: "10px" }}
        onClick={() => fetchStudents(1)}
      >
        Refresh List
      </button>

      {students.length === 0 ? (
        <p>No students added yet.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Department</th>
                <th>Degree</th>
                <th>Added On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.department}</td>
                  <td>{student.degree}</td>
                  <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(student)}
                    >
                      Edit
                    </button>
                    <button
                      style={{ marginLeft: 8 }}
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(student._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* pagination controls */}
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <button
              className="btn btn-secondary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span style={{ margin: "0 15px" }}>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-secondary"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentList;
