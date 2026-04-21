import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/api/tasks`, { headers });
      setTasks(res.data);
    } catch (err) {
      setError("Failed to load tasks. Is the backend running?");
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/api/tasks`, { title: newTask }, { headers });
      setTasks([res.data, ...tasks]);
      setNewTask("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add task. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (task) => {
    try {
      const res = await axios.put(`${API}/api/tasks/${task._id}`, { completed: !task.completed }, { headers });
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    } catch {
      setError("Failed to update task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/api/tasks/${id}`, { headers });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch {
      setError("Failed to delete task.");
    }
  };

  const saveEdit = async (id) => {
    try {
      const res = await axios.put(`${API}/api/tasks/${id}`, { title: editTitle }, { headers });
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
      setEditId(null);
    } catch {
      setError("Failed to save edit.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>📝 Todo App</h2>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Hi, {user?.name}!</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <h3 style={styles.heading}>My Tasks</h3>

        {error && <p style={styles.error}>⚠️ {error}</p>}

        {/* Add Task */}
        <form onSubmit={addTask} style={styles.addForm}>
          <input
            style={styles.addInput}
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button style={styles.addBtn} type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </button>
        </form>

        {/* Task List */}
        {tasks.length === 0 && <p style={styles.empty}>No tasks yet. Add one above!</p>}
        {tasks.map((task) => (
          <div key={task._id} style={styles.taskCard}>
            {editId === task._id ? (
              <div style={styles.editRow}>
                <input
                  style={styles.editInput}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <button style={styles.saveBtn} onClick={() => saveEdit(task._id)}>Save</button>
                <button style={styles.cancelBtn} onClick={() => setEditId(null)}>Cancel</button>
              </div>
            ) : (
              <div style={styles.taskRow}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task)}
                  style={{ marginRight: "10px", cursor: "pointer" }}
                />
                <span style={{ ...styles.taskTitle, textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "#aaa" : "#333" }}>
                  {task.title}
                </span>
                <div style={styles.actions}>
                  <button style={styles.editBtn} onClick={() => { setEditId(task._id); setEditTitle(task.title); }}>Edit</button>
                  <button style={styles.deleteBtn} onClick={() => deleteTask(task._id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f0f2f5", fontFamily: "sans-serif" },
  navbar: { backgroundColor: "#4f46e5", padding: "14px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  navTitle: { color: "#fff", margin: 0 },
  navRight: { display: "flex", alignItems: "center", gap: "14px" },
  welcome: { color: "#fff", fontSize: "14px" },
  logoutBtn: { padding: "6px 14px", backgroundColor: "#fff", color: "#4f46e5", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  main: { maxWidth: "600px", margin: "40px auto", padding: "0 16px" },
  heading: { fontSize: "20px", marginBottom: "16px", color: "#333" },
  addForm: { display: "flex", gap: "10px", marginBottom: "20px" },
  addInput: { flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" },
  addBtn: { padding: "10px 20px", backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  taskCard: { backgroundColor: "#fff", padding: "12px 16px", borderRadius: "8px", marginBottom: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  taskRow: { display: "flex", alignItems: "center" },
  taskTitle: { flex: 1, fontSize: "15px" },
  actions: { display: "flex", gap: "8px" },
  editBtn: { padding: "4px 10px", backgroundColor: "#f59e0b", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
  deleteBtn: { padding: "4px 10px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
  editRow: { display: "flex", gap: "8px", alignItems: "center" },
  editInput: { flex: 1, padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" },
  saveBtn: { padding: "5px 12px", backgroundColor: "#22c55e", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
  cancelBtn: { padding: "5px 12px", backgroundColor: "#6b7280", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
  empty: { color: "#aaa", textAlign: "center", marginTop: "30px" },
  error: { color: "red", backgroundColor: "#fff0f0", padding: "10px", borderRadius: "6px", marginBottom: "14px", fontSize: "13px" },
};
