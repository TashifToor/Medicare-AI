import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register }          = useAuth();
  const navigate              = useNavigate();
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  // Error ko hamesha string banao
  const parseError = (err) => {
    const detail = err?.response?.data?.detail;
    if (!detail) return "Registration failed. Please try again.";
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((d) => d.msg).join(", ");
    return "Something went wrong. Please try again.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/chat");
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0f172a",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
    }}>
      <div style={{
        background: "#1e293b", border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "400px"
      }}>

        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "32px" }}>
          <div style={{
            width: "52px", height: "52px", background: "#3b82f6",
            borderRadius: "14px", display: "flex", alignItems: "center",
            justifyContent: "center", marginBottom: "14px"
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h1 style={{ color: "white", fontSize: "20px", fontWeight: "500", margin: 0 }}>Create Account</h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginTop: "4px" }}>Join MediCare AI</p>
        </div>

        {/* Error box */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "0.5px solid rgba(239,68,68,0.25)",
            color: "#f87171", borderRadius: "8px", padding: "10px 14px",
            fontSize: "13px", marginBottom: "20px"
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "12px", marginBottom: "6px" }}>
              Full Name
            </label>
            <input
              type="text" required
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Dr. John Smith"
              style={{
                width: "100%", background: "#0f172a",
                border: "0.5px solid rgba(255,255,255,0.1)",
                borderRadius: "8px", padding: "10px 14px",
                color: "white", fontSize: "13px",
                outline: "none", boxSizing: "border-box"
              }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "12px", marginBottom: "6px" }}>
              Email address
            </label>
            <input
              type="email" required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="doctor@hospital.com"
              style={{
                width: "100%", background: "#0f172a",
                border: "0.5px solid rgba(255,255,255,0.1)",
                borderRadius: "8px", padding: "10px 14px",
                color: "white", fontSize: "13px",
                outline: "none", boxSizing: "border-box"
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "12px", marginBottom: "6px" }}>
              Password
            </label>
            <input
              type="password" required
              autoComplete="new-password"
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min 6 characters"
              style={{
                width: "100%", background: "#0f172a",
                border: "0.5px solid rgba(255,255,255,0.1)",
                borderRadius: "8px", padding: "10px 14px",
                color: "white", fontSize: "13px",
                outline: "none", boxSizing: "border-box"
              }}
            />
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: "100%",
              background: loading ? "rgba(59,130,246,0.5)" : "#3b82f6",
              border: "none", borderRadius: "8px", padding: "11px",
              color: "white", fontSize: "14px", fontWeight: "500",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px", marginTop: "24px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#60a5fa", textDecoration: "none" }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
