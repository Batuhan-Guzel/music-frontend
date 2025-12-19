import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminArtists from "./pages/AdminArtists";
import AdminAlbums from "./pages/AdminAlbums";
import AdminSongs from "./pages/AdminSongs";
import UserPlaylists from "./pages/UserPlaylists";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import { getRole, isLoggedIn, logout } from "./auth";

export default function App() {
  const nav = useNavigate();
  const logged = isLoggedIn();
  const role = getRole();

  return (
    <div style={{ fontFamily: "system-ui", padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <Link to="/" style={{ fontWeight: 700 }}>Music App</Link>
        <Link to="/dashboard">Dashboard</Link>

        {logged && role === "ADMIN" && (
          <>
            <Link to="/admin/artists">Artists</Link>
            <Link to="/admin/albums">Albums</Link>
            <Link to="/admin/songs">Songs</Link>
          </>
        )}

        {logged && role === "USER" && (
          <Link to="/my-playlists">My Playlists</Link>
        )}

        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ opacity: 0.7 }}>{logged ? `Role: ${role}` : "Guest"}</span>
          {!logged ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <button
              onClick={() => {
                logout();
                nav("/login");
              }}
            >
              Logout
            </button>
          )}
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/artists"
          element={
            <RoleRoute allow={["ADMIN"]}>
              <AdminArtists />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/albums"
          element={
            <RoleRoute allow={["ADMIN"]}>
              <AdminAlbums />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/songs"
          element={
            <RoleRoute allow={["ADMIN"]}>
              <AdminSongs />
            </RoleRoute>
          }
        />

        <Route
          path="/my-playlists"
          element={
            <RoleRoute allow={["USER"]}>
              <UserPlaylists />
            </RoleRoute>
          }
        />
      </Routes>
    </div>
  );
}
