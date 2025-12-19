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
    <div>
      <h2>Admin - Albums</h2>

      <div style={{ display: "grid", gap: 8, maxWidth: 420, marginBottom: 12 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Album title" />
        <select value={artistId} onChange={(e) => setArtistId(Number(e.target.value))}>
          {artists.map((a) => (
            <option key={a.id} value={a.id}>
              #{a.id} - {a.name}
            </option>
          ))}
        </select>
        <button onClick={create}>Add Album</button>
        {msg && <div style={{ color: "crimson" }}>{msg}</div>}
      </div>

      <ul>
        {albums.map((al) => (
          <li key={al.id}>
            #{al.id} - {al.title} (Artist: {al.artist?.name})
          </li>
        ))}
      </ul>
    </div>
  );
}
