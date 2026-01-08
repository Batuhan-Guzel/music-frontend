import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [msg, setMsg] = useState("");

  async function submit() {
    setMsg("");
    try {
      await api.post("/auth/register", {
        email,
        password,
        ...(adminCode.trim() ? { adminCode: adminCode.trim() } : {}),
      });
      nav("/login");
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Register failed");
    }
  }

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <div className="card-header">
          <h2>Register</h2>
          <span className="muted">Create a new account</span>
        </div>

        <div className="form">
          <div className="row">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              type="password"
            />
          </div>

          <input
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            placeholder="Admin Code (optional)"
          />

          <button onClick={submit} className="btn-primary" disabled={!email.trim() || !password.trim()}>
            Register
          </button>

          {msg && <div className="error">{msg}</div>}

          <div className="muted" style={{ fontSize: 12 }}>
            Admin olmak için Admin Code gir (örn: <b>ADMIN123</b>). Boş bırakılınca USER olur.
          </div>
        </div>
      </div>
    </div>
  );
}
