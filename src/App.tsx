import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
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
    <div className="app">
      <header className="header">
        <div className="container header-inner">
          <NavLink to="/" className="brand">
            <span className="brand-dot" />
            Music App
          </NavLink>

          <nav className="nav">
            <NavLink to="/dashboard">Dashboard</NavLink>

            {logged && role === "ADMIN" && (
              <>
                <NavLink to="/admin/artists">Artists</NavLink>
                <NavLink to="/admin/albums">Albums</NavLink>
                <NavLink to="/admin/songs">Songs</NavLink>
              </>
            )}

            {logged && role === "USER" && (
              <NavLink to="/my-playlists">My Playlists</NavLink>
            )}

            {!logged && (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </nav>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span className="badge">{logged ? `Role: ${role}` : "Guest"}</span>
            {logged && (
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
        </div>
      </header>

      <main className="container">
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
      </main>
    </div>
  );
}
