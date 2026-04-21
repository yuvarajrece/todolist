import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:5000";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${API}/api/auth/login`, form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button style={styles.button} type="submit">Login</button>
        </form>
        <p style={styles.link}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5" },
  box: { backgroundColor: "#fff", padding: "40px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", width: "360px" },
  title: { textAlign: "center", marginBottom: "20px", color: "#333" },
  input: { width: "100%", padding: "10px", marginBottom: "14px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", boxSizing: "border-box" },
  button: { width: "100%", padding: "10px", backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "6px", fontSize: "15px", cursor: "pointer" },
  error: { color: "red", fontSize: "13px", marginBottom: "10px" },
  link: { textAlign: "center", marginTop: "14px", fontSize: "13px" },
};
