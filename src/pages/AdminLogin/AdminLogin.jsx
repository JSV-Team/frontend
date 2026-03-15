import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginApi } from "../../services/auth/authApi";

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/admin";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const result = await loginApi(formData);

      if (result.success) {
        localStorage.setItem("token", "dummy-token-" + result.data.user_id); // Backend currently doesn't return token in verifyUser
        localStorage.setItem("role", result.data.role);
        localStorage.setItem("user", JSON.stringify(result.data));

        if (result.data.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          setError("Bạn không có quyền truy cập vào khu vực admin.");
        }
      } else {
        setError(result.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
            <h1 style={styles.title}>JSV Admin</h1>
            <p style={styles.subtitle}>Vui lòng đăng nhập để tiếp tục</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email hoặc Username</label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Nhập email hoặc username"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              style={styles.input}
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f172a",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-1px",
  },
  subtitle: {
    marginTop: "8px",
    color: "#64748b",
    fontSize: "15px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#0f172a",
  },
  input: {
    height: "52px",
    borderRadius: "14px",
    border: "1px solid #dbe3ef",
    padding: "0 16px",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    height: "52px",
    border: "none",
    borderRadius: "14px",
    background: "#3853b8",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 15px rgba(56, 83, 184, 0.2)",
    transition: "transform 0.1s, background 0.2s",
  },
  error: {
    margin: 0,
    color: "#dc2626",
    fontSize: "14px",
    fontWeight: 500,
    textAlign: "center",
  },
};

export default AdminLogin;
