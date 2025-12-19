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
    <div>
      <h2>Dashboard</h2>
      {!isLoggedIn() && <div>Login olunca rolüne göre menü açılacak.</div>}
      {msg && <div style={{ color: "crimson" }}>{msg}</div>}
      {me && (
        <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 8 }}>
{JSON.stringify(me, null, 2)}
        </pre>
      )}
    </div>
  );
}
