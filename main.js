import { authURL, fetchUser, saveSession, loadSession, clearSession } from "./auth.js";
import { initFeedbackModal, loadWebhook } from "./feedback.js";

// hero parallax
document.addEventListener("mousemove", (e) => {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const { innerWidth: w, innerHeight: h } = window;
  const { clientX: x, clientY: y } = e;
  hero.style.backgroundPosition = `${50 + (x / w - 0.5) * 20}% ${50 + (y / h - 0.5) * 20}%`;
});

// auth
const loginBtn = document.querySelector(".login-btn");
if (loginBtn) loginBtn.onclick = () => (location.href = authURL);

const session = loadSession();
if (session) {
  showUser(session.user);
} else if (location.hash.includes("access_token")) {
  const hash = new URLSearchParams(location.hash.slice(1));
  const token = hash.get("access_token");
  if (token) fetchUser(token).then((u) => {
    saveSession(u, token);
    showUser(u);
  }).catch(() => {});
  history.replaceState({}, document.title, location.pathname);
}

function showUser(user) {
  const url = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
  const menu = document.createElement("div");
  menu.className = "user-menu";
  menu.innerHTML = `<img src="${url}" alt="Avatar" class="user-avatar"><div class="dropdown"><button>Logout</button></div>`;
  menu.querySelector("button").onclick = clearSession;
  menu.querySelector(".user-avatar").onclick = () => menu.querySelector(".dropdown").classList.toggle("show");
  const btn = document.querySelector(".login-btn");
  if (btn && btn.parentElement) btn.parentElement.replaceChild(menu, btn);
}

// feedback
initFeedbackModal();
loadWebhook();
