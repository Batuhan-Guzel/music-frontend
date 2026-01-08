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
    <div className="page">
      <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <div className="card-header">
          <h2>Login</h2>
          <span className="muted">Sign in to continue</span>
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

          <button onClick={submit} className="btn-primary">
            Login
          </button>

          {msg && <div className="error">{msg}</div>}

          <div className="muted" style={{ fontSize: 12 }}>
            Not: Token localStorage’a kaydedilir ve sonraki isteklerde Authorization header’ına eklenir.
          </div>
        </div>
      </div>
    </div>
  );
}
