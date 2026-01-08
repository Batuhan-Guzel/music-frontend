import { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminAlbums() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [artistId, setArtistId] = useState<number>(0);
  const [msg, setMsg] = useState("");

  async function load() {
    const [a1, a2] = await Promise.all([api.get("/album"), api.get("/artist")]);
    setAlbums(a1.data);
    setArtists(a2.data);
    if (a2.data?.length && artistId === 0) setArtistId(a2.data[0].id);
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    setMsg("");
    try {
      await api.post("/album", { title, artistId });
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
          <h2>Admin · Albums</h2>
          <span className="muted">Create & list albums</span>
        </div>

        <div className="form">
          <div className="row">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Album title" />

            <select value={artistId} onChange={(e) => setArtistId(Number(e.target.value))}>
              {artists.map((a) => (
                <option key={a.id} value={a.id}>
                  #{a.id} - {a.name}
                </option>
              ))}
            </select>
          </div>

          <button onClick={create} className="btn-primary" disabled={!title.trim() || !artistId}>
            Add Album
          </button>
          {msg && <div className="error">{msg}</div>}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Albums</h2>
          <span className="muted">{albums.length} item(s)</span>
        </div>

        <div className="list">
          {albums.map((al) => (
            <div className="list-item" key={al.id}>
              <b>#{al.id}</b> <span className="muted">·</span> {al.title}
              <div className="muted" style={{ marginTop: 4 }}>
                Artist: {al.artist?.name ?? "-"}
              </div>
            </div>
          ))}
          {!albums.length && <div className="muted">No albums yet.</div>}
        </div>
      </div>
    </div>
  );
}
