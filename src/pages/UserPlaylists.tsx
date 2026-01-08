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

  async function loadPlaylists(preserveSelectedId?: number) {
    const res = await api.get("/playlist/my");
    const list: Playlist[] = res.data ?? [];
    setPlaylists(list);

    const desired = preserveSelectedId ?? playlistId;
    const exists = desired && list.some((p) => p.id === desired);

    if (exists) setPlaylistId(desired);
    else if (list.length) setPlaylistId(list[0].id);
    else setPlaylistId(0);

    setRenameById((prev) => {
      const next = { ...prev };
      for (const p of list) if (next[p.id] === undefined) next[p.id] = p.name;
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
    const trimmed = name.trim();
    if (!trimmed) return;

    try {
      const res = await api.post("/playlist", { name: trimmed });
      const created: Playlist = res.data;
      setName("");
      await loadPlaylists(created.id);
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Create playlist failed");
    }
  }

  async function addSong() {
    setMsg("");
    if (!playlistId || !songId) return;
    try {
      await api.post(`/playlist/${playlistId}/songs`, { songId });
      await loadPlaylists(playlistId);
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Add song failed");
    }
  }

  async function removeSong(pid: number, sid: number) {
    setMsg("");
    try {
      await api.delete(`/playlist/${pid}/songs/${sid}`);
      await loadPlaylists(pid);
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Remove song failed");
    }
  }

  async function renamePlaylist(pid: number) {
    setMsg("");
    try {
      const newName = (renameById[pid] ?? "").trim();
      if (!newName) return;
      await api.patch(`/playlist/${pid}`, { name: newName });
      await loadPlaylists(pid);
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Rename failed");
    }
  }

  async function deletePlaylist(pid: number) {
    setMsg("");
    try {
      await api.delete(`/playlist/${pid}`);
      await loadPlaylists();
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Delete failed");
    }
  }

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <h2>User · My Playlists</h2>
          <span className="muted">Create, rename, delete, add/remove songs</span>
        </div>

        <div className="form">
          <div className="row">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Playlist name" />
            <button onClick={createPlaylist} className="btn-primary" disabled={!name.trim()}>
              Create Playlist
            </button>
          </div>

          <div className="row">
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
          </div>

          <button onClick={addSong} className="btn-primary" disabled={!playlistId || !songId}>
            Add Song To Selected Playlist
          </button>

          {msg && <div className="error">{msg}</div>}
        </div>
      </div>

      {playlists.map((p) => (
        <div key={p.id} className="card">
          <div className="card-header">
            <h2 style={{ fontSize: 16 }}>{p.name}</h2>
            <div style={{ display: "flex", gap: 8 }}>
              <span className="badge">#{p.id}</span>
              <button onClick={() => deletePlaylist(p.id)} className="btn-danger">
                Delete
              </button>
            </div>
          </div>

          <div className="form">
            <div className="row">
              <input
                value={renameById[p.id] ?? ""}
                onChange={(e) => setRenameById((prev) => ({ ...prev, [p.id]: e.target.value }))}
                placeholder="New name"
              />
              <button onClick={() => renamePlaylist(p.id)}>Rename</button>
            </div>

            <div className="list">
              {(p.songs ?? []).map((s: any) => (
                <div
                  key={s.id}
                  className="list-item"
                  style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}
                >
                  <div>
                    <b>{s.title}</b>
                    <div className="muted" style={{ marginTop: 2 }}>
                      Album: {s.album?.title ?? "-"}
                    </div>
                  </div>
                  <button onClick={() => removeSong(p.id, s.id)} className="btn-danger">
                    Remove
                  </button>
                </div>
              ))}
              {!p.songs?.length && <div className="muted">Bu playlist’te henüz şarkı yok.</div>}
            </div>
          </div>
        </div>
      ))}

      {!playlists.length && <div className="muted">Henüz playlist’in yok. Yukarıdan oluşturabilirsin.</div>}
    </div>
  );
}
