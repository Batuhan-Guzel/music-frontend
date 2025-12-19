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
    <div>
      <h2>Admin - Songs</h2>

      <div style={{ display: "grid", gap: 8, maxWidth: 420, marginBottom: 12 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Song title" />
        <select value={albumId} onChange={(e) => setAlbumId(Number(e.target.value))}>
          {albums.map((al) => (
            <option key={al.id} value={al.id}>
              #{al.id} - {al.title}
            </option>
          ))}
        </select>
        <button onClick={create}>Add Song</button>
        {msg && <div style={{ color: "crimson" }}>{msg}</div>}
      </div>

      <ul>
        {songs.map((s) => (
          <li key={s.id}>
            #{s.id} - {s.title} (Album: {s.album?.title})
          </li>
        ))}
      </ul>
    </div>
  );
}
