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
    <div className="page">
      <div className="card">
        <div className="card-header">
          <h2>Admin · Artists</h2>
          <span className="muted">Create & list artists</span>
        </div>

        <div className="form">
          <div className="row">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Artist name" />
            <button onClick={create} className="btn-primary" disabled={!name.trim()}>
              Add Artist
            </button>
          </div>
          {msg && <div className="error">{msg}</div>}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Artists</h2>
          <span className="muted">{list.length} item(s)</span>
        </div>

        <div className="list">
          {list.map((a) => (
            <div className="list-item" key={a.id}>
              <b>#{a.id}</b> <span className="muted">·</span> {a.name}
            </div>
          ))}
          {!list.length && <div className="muted">No artists yet.</div>}
        </div>
      </div>
    </div>
  );
}
