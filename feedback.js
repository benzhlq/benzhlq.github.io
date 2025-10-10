import { webhook as GITHUB_WEBHOOK } from "./config.secret.js";
import { initStars } from "./stars.js";
let webhook = GITHUB_WEBHOOK;

export async function loadWebhook() {
  // If CI injected a real webhook (not the local fallback), we already have it.
  if (webhook && webhook !== "http://localhost") return;
  try {
    const res = await fetch("/api/config");
    if (!res.ok) return;
    const data = await res.json();
    if (data.webhookUrl) webhook = data.webhookUrl;
  } catch {}
}

export function initFeedbackModal() {
  const overlay = document.getElementById("modal-overlay");
  const modal = document.getElementById("feedback-modal");
  const openBtn = document.getElementById("open-feedback");
  const subBtn = document.getElementById("submit-feedback");
  const textInp = document.querySelector(".feedback-text");
  const stars = initStars();

  if (openBtn)
    openBtn.onclick = () => {
      if (overlay) overlay.style.display = "block";
      if (modal) modal.style.display = "block";
    };
  if (overlay) overlay.onclick = close;
  if (subBtn)
    subBtn.onclick = async () => {
      if (stars.value === 0) {
        const el = document.getElementById("star-error");
        if (el) el.textContent = "Field required";
        return;
      }
      if (!webhook || webhook === "http://localhost") {
        alert("Feedback feature is not configured yet.");
        return;
      }

      const embed = {
        embeds: [
          {
            title: "Honeycomb Feedback",
            color: 16776960,
            fields: [
              { name: "**Stars:**", value: "⭐".repeat(stars.value) },
              ...(textInp && textInp.value ? [{ name: "**Feedback:**", value: textInp.value }] : []),
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      };

      try {
        const res = await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(embed),
        });
        if (res.ok) {
          alert("Feedback submitted!");
          close();
        } else {
          throw new Error("HTTP " + res.status);
        }
      } catch {
        alert("Failed to submit feedback.");
      }
    };

  function close() {
    if (overlay) overlay.style.display = "none";
    if (modal) modal.style.display = "none";
    if (textInp) textInp.value = "";
    stars.reset();
  }
}
