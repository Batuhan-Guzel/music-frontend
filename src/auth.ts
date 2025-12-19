export function setToken(token: string) {
  localStorage.setItem("access_token", token);
}

export function getToken() {
  return localStorage.getItem("access_token");
}

export function logout() {
  localStorage.removeItem("access_token");
}

function base64UrlToBase64(input: string) {
  return input.replace(/-/g, "+").replace(/_/g, "/");
}

export function getJwtPayload(): any | null {
  const token = getToken();
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const payload = parts[1];
    const decoded = atob(base64UrlToBase64(payload));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function getRole(): string | null {
  const payload = getJwtPayload();
  return payload?.role ?? null;
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
