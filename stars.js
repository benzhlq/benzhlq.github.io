export function initStars() {
  const stars = document.querySelectorAll(".star");
  const errEl = document.getElementById("star-error");
  let picked = 0;

  stars.forEach((s, i) => {
    const idx = i + 1;
    s.onmouseenter = () => highlight(idx);
    s.onclick = () => {
      picked = idx;
      highlight(idx);
    };
  });

  const container = document.getElementById("star-container");
  if (container) container.onmouseleave = () => highlight(picked);

  function highlight(upto) {
    stars.forEach((s, i) => s.classList.toggle("selected", i < upto));
  }

  return {
    get value() {
      return picked;
    },
    reset() {
      picked = 0;
      highlight(0);
      if (errEl) errEl.textContent = "";
    },
  };
}
