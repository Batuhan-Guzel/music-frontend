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
    <div>
      <h2>Register</h2>

      <div style={{ display: "grid", gap: 8, maxWidth: 360 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          type="password"
        />

        <input
          value={adminCode}
          onChange={(e) => setAdminCode(e.target.value)}
          placeholder="Admin Code (optional)"
        />

        <button onClick={submit}>Register</button>

        {msg && <div style={{ color: "crimson" }}>{msg}</div>}

        <div style={{ fontSize: 12, opacity: 0.7 }}>
          Admin olmak için Admin Code gir (örn: <b>ADMIN123</b>). Boş bırakırsan USER olur.
        </div>
      </div>
    </div>
  );
}
