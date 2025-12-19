import { useEffect, useState } from "react";
import { api } from "../api";

type Playlist = {
  id: number;
  name: string;
  songs?: any[];
};

export default function UserPlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [playlistId, setPlaylistId] = useState<number>(0);
  const [songId, setSongId] = useState<number>(0);
  const [renameById, setRenameById] = useState<Record<number, string>>({});
  const [msg, setMsg] = useState("");

  async function loadPlaylists() {
    const res = await api.get("/playlist/my");
    const list: Playlist[] = res.data ?? [];
    setPlaylists(list);

    if (list.length && playlistId === 0) {
      setPlaylistId(list[0].id);
    }

    setRenameById((prev) => {
      const next = { ...prev };
      for (const p of list) {
        if (next[p.id] === undefined) next[p.id] = p.name;
      }
      return next;
    });
  }

  async function loadSongs() {
    try {
      const res = await api.get("/song");
      const list = res.data ?? [];
      setSongs(list);
      if (list.length && songId === 0) setSongId(list[0].id);
    } catch {
      setSongs([]);
    }
  }

  async function load() {
    setMsg("");
    try {
      await loadPlaylists();
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Cannot load playlists");
    }
    await loadSongs();
  }

  useEffect(() => {
    load();
  }, []);

  async function createPlaylist() {
    setMsg("");
    try {
      const res = await api.post("/playlist", { name });
      setName("");
      const created: Playlist = res.data;
      setPlaylists((prev) => [created, ...prev]);
      setRenameById((prev) => ({ ...prev, [created.id]: created.name }));
      setPlaylistId(created.id);
      await loadPlaylists();
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Create playlist failed");
    }
  }

  async function addSong() {
    setMsg("");
    if (!playlistId || !songId) return;
    try {
      await api.post(`/playlist/${playlistId}/songs`, { songId });
      await loadPlaylists();
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Add song failed");
    }
  }

  async function removeSong(pid: number, sid: number) {
    setMsg("");
    try {
      await api.delete(`/playlist/${pid}/songs/${sid}`);
      await loadPlaylists();
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Remove song failed");
    }
  }

  async function renamePlaylist(pid: number) {
    setMsg("");
    try {
      const newName = renameById[pid]?.trim();
      await api.patch(`/playlist/${pid}`, { name: newName });
      await loadPlaylists();
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Rename failed");
    }
  }

  async function deletePlaylist(pid: number) {
    setMsg("");
    try {
      await api.delete(`/playlist/${pid}`);
      setPlaylists((prev) => prev.filter((p) => p.id !== pid));
      await loadPlaylists();
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Delete failed");
    }
  }

  return (
    <div>
      <h2>User - My Playlists</h2>

      <div style={{ display: "grid", gap: 10, maxWidth: 620, marginBottom: 14 }}>
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
            <option value={0}>Select playlist</option>
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

          <button onClick={addSong} disabled={!playlistId || !songId}>
            Add Song
          </button>
        </div>

        {msg && <div style={{ color: "crimson" }}>{msg}</div>}
      </div>

      {playlists.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <b>{p.name}</b>
            <button onClick={() => deletePlaylist(p.id)}>Delete</button>
          </div>

          <div style={{ marginTop: 8 }}>
            <input
              value={renameById[p.id] ?? ""}
              onChange={(e) =>
                setRenameById((prev) => ({ ...prev, [p.id]: e.target.value }))
              }
              placeholder="New name"
            />
            <button onClick={() => renamePlaylist(p.id)}>Rename</button>
          </div>

          <ul>
            {(p.songs ?? []).map((s: any) => (
              <li key={s.id}>
                {s.title} ({s.album?.title})
                <button onClick={() => removeSong(p.id, s.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
