import { useEffect, useState } from "react";
import { api } from "../api";
import { isLoggedIn } from "../auth";

export default function Dashboard() {
  const [me, setMe] = useState<any>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function run() {
      if (!isLoggedIn()) return;
      try {
        const res = await api.get("/user/me");
        setMe(res.data);
      } catch (e: any) {
        setMsg(e?.response?.data?.message ?? "Cannot load /user/me");
      }
    }
    run();
  }, []);

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <h2>Dashboard</h2>
          <span className="muted">Welcome</span>
        </div>

        {!isLoggedIn() && (
          <div className="muted">
            Login olunca rolüne göre menü açılacak. Admin ise içerik yönetimi, User ise playlist yönetimi görecek.
          </div>
        )}

        {msg && (
          <div className="error" style={{ marginTop: 10 }}>
            {msg}
          </div>
        )}
      </div>

      {me && (
        <div className="card">
          <div className="card-header">
            <h2>/user/me</h2>
            <span className="muted">JWT payload & user info</span>
          </div>
          <pre>{JSON.stringify(me, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
