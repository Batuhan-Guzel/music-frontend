import { useState } from "react";
import { api } from "../api";
import { setToken } from "../auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("123456");
  const [msg, setMsg] = useState("");

  async function submit() {
    setMsg("");
    try {
      const res = await api.post("/auth/login", { email, password });
      setToken(res.data.access_token);
      nav("/dashboard");
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Login failed");
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <div style={{ display: "grid", gap: 8, maxWidth: 360 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
        <button onClick={submit}>Login</button>
        {msg && <div style={{ color: "crimson" }}>{msg}</div>}
      </div>
    </div>
  );
}
