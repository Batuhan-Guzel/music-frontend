import { useEffect, useState } from "react";
import { api } from "../api";

export default function UserPlaylists() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [playlistId, setPlaylistId] = useState<number>(0);
  const [songId, setSongId] = useState<number>(0);
  const [rename, setRename] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const [p, s] = await Promise.all([
      api.get("/playlist/my"),
      api.get("/song"),
    ]);
    setPlaylists(p.data);
    setSongs(s.data);

    if (p.data.length && playlistId === 0) setPlaylistId(p.data[0].id);
    if (s.data.length && songId === 0) setSongId(s.data[0].id);
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

  async function removeSong(pid: number, sid: number) {
    setMsg("");
    try {
      await api.delete(`/playlist/${pid}/songs/${sid}`);
      await load();
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Remove song failed");
    }
  }

  async function renamePlaylist(pid: number) {
    setMsg("");
    try {
      await api.patch(`/playlist/${pid}`, { name: rename });
      setRename("");
      await load();
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Rename failed");
    }
  }

  async function deletePlaylist(pid: number) {
    setMsg("");
    try {
      await api.delete(`/playlist/${pid}`);
      await load();
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Delete failed");
    }
  }

  return (
    <div>
      <h2>My Playlists</h2>

      <div style={{ display: "grid", gap: 10, maxWidth: 520, marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Playlist name"
          />
          <button onClick={createPlaylist}>Create</button>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <select value={playlistId} onChange={(e) => setPlaylistId(Number(e.target.value))}>
            {playlists.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.id} - {p.name}
              </option>
            ))}
          </select>

          <select value={songId} onChange={(e) => setSongId(Number(e.target.value))}>
            {songs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>

          <button onClick={addSong}>Add Song</button>
        </div>

        {msg && <div style={{ color: "crimson" }}>{msg}</div>}
      </div>

      {playlists.map((p) => (
        <div
          key={p.id}
          style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, marginBottom: 12 }}
        >
          <b>{p.name}</b>

          <div style={{ marginTop: 8 }}>
            <input
              placeholder="New name"
              value={rename}
              onChange={(e) => setRename(e.target.value)}
            />
            <button onClick={() => renamePlaylist(p.id)}>Rename</button>
            <button onClick={() => deletePlaylist(p.id)}>Delete</button>
          </div>

          <div style={{ marginTop: 10 }}>
            <b>Songs:</b>
            <ul>
              {(p.songs ?? []).map((s: any) => (
                <li key={s.id}>
                  {s.title} ({s.album?.title})
                  <button
                    style={{ marginLeft: 8 }}
                    onClick={() => removeSong(p.id, s.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
