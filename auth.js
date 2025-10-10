import { CLIENT_ID, REDIRECT_URI, SCOPE } from "./config.js";

export const authURL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;

export async function fetchUser(token) {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Invalid token");
  return res.json();
}

export function saveSession(user, token) {
  localStorage.setItem("discord_user", JSON.stringify(user));
  localStorage.setItem("discord_token", token);
}

export function clearSession() {
  localStorage.removeItem("discord_user");
  localStorage.removeItem("discord_token");
  location.reload();
}

export function loadSession() {
  const t = localStorage.getItem("discord_token");
  const u = localStorage.getItem("discord_user");
  return t && u ? { token: t, user: JSON.parse(u) } : null;
}
