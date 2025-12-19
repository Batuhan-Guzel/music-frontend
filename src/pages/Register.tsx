import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit() {
    setMsg("");
    try {
      await api.post("/auth/register", { email, password });
      nav("/login");
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Register failed");
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <div style={{ display: "grid", gap: 8, maxWidth: 360 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
        <button onClick={submit}>Register</button>
        {msg && <div style={{ color: "crimson" }}>{msg}</div>}
      </div>
    </div>
  );
}
