import { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminSongs() {
  const [songs, setSongs] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [albumId, setAlbumId] = useState<number>(0);
  const [msg, setMsg] = useState("");

  async function load() {
    const [s1, s2] = await Promise.all([api.get("/song"), api.get("/album")]);
    setSongs(s1.data);
    setAlbums(s2.data);
    if (s2.data?.length && albumId === 0) setAlbumId(s2.data[0].id);
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    setMsg("");
    try {
      await api.post("/song", { title, albumId });
      setTitle("");
      await load();
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Create failed");
    }
  }

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <h2>Admin · Songs</h2>
          <span className="muted">Create & list songs</span>
        </div>

        <div className="form">
          <div className="row">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Song title" />

            <select value={albumId} onChange={(e) => setAlbumId(Number(e.target.value))}>
              {albums.map((al) => (
                <option key={al.id} value={al.id}>
                  #{al.id} - {al.title}
                </option>
              ))}
            </select>
          </div>

          <button onClick={create} className="btn-primary" disabled={!title.trim() || !albumId}>
            Add Song
          </button>
          {msg && <div className="error">{msg}</div>}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Songs</h2>
          <span className="muted">{songs.length} item(s)</span>
        </div>

        <div className="list">
          {songs.map((s) => (
            <div className="list-item" key={s.id}>
              <b>#{s.id}</b> <span className="muted">·</span> {s.title}
              <div className="muted" style={{ marginTop: 4 }}>
                Album: {s.album?.title ?? "-"}
              </div>
            </div>
          ))}
          {!songs.length && <div className="muted">No songs yet.</div>}
        </div>
      </div>
    </div>
  );
}
