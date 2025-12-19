import { useEffect, useState } from "react";
import { api } from "../api";

export default function UserPlaylists() {
  const [my, setMy] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [playlistId, setPlaylistId] = useState<number>(0);
  const [songId, setSongId] = useState<number>(0);
  const [msg, setMsg] = useState("");

  async function load() {
    const [p, s] = await Promise.all([api.get("/playlist/my"), api.get("/song")]);
    setMy(p.data);
    setSongs(s.data);

    if (p.data?.length && playlistId === 0) setPlaylistId(p.data[0].id);
    if (s.data?.length && songId === 0) setSongId(s.data[0].id);
  }

  useEffect(() => {
    load();
  }, []);

  async function createPlaylist() {
    setMsg("");
    try {
      await api.post("/playlist", { name });
      setName("");
      await load();
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Create playlist failed");
    }
  }

  async function addSong() {
    setMsg("");
    try {
      await api.post(`/playlist/${playlistId}/songs`, { songId });
      await load();
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Add song failed");
    }
  }

  return (
    <div>
      <h2>User - My Playlists</h2>

      <div style={{ display: "grid", gap: 10, maxWidth: 520, marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Playlist name" />
          <button onClick={createPlaylist}>Create</button>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select value={playlistId} onChange={(e) => setPlaylistId(Number(e.target.value))}>
            {my.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.id} - {p.name}
              </option>
            ))}
          </select>

          <select value={songId} onChange={(e) => setSongId(Number(e.target.value))}>
            {songs.map((s) => (
              <option key={s.id} value={s.id}>
                #{s.id} - {s.title}
              </option>
            ))}
          </select>

          <button onClick={addSong}>Add Song</button>
        </div>

        {msg && <div style={{ color: "crimson" }}>{msg}</div>}
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {my.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
            <div style={{ fontWeight: 700 }}>
              #{p.id} - {p.name}
            </div>
            <div style={{ opacity: 0.8, marginTop: 6 }}>Songs:</div>
            <ul>
              {(p.songs ?? []).map((s: any) => (
                <li key={s.id}>
                  #{s.id} - {s.title} (Album: {s.album?.title})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
