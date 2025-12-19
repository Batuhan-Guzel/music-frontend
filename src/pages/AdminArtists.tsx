import { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminArtists() {
  const [list, setList] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await api.get("/artist");
    setList(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    setMsg("");
    try {
      await api.post("/artist", { name });
      setName("");
      await load();
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Create failed");
    }
  }

  return (
    <div>
      <h2>Admin - Artists</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Artist name" />
        <button onClick={create}>Add</button>
      </div>
      {msg && <div style={{ color: "crimson" }}>{msg}</div>}
      <ul>
        {list.map((a) => (
          <li key={a.id}>#{a.id} - {a.name}</li>
        ))}
      </ul>
    </div>
  );
}
