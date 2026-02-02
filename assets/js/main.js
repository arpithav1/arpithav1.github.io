async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  });
  children.forEach((c) => node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
  return node;
}

async function renderPosts() {
  const mount = document.querySelector("[data-posts]");
  if (!mount) return;

  const data = await loadJSON("/data/posts.json");
  mount.innerHTML = "";

  data.posts.forEach((p) => {
    const left = el("div", {}, [
      el("div", { class: "item-title" }, [p.title]),
      el("div", { class: "item-meta" }, [`${p.date} • ${p.readTime} min • ${p.category}`]),
    ]);

    const tag = el("div", { class: "tag" }, [p.vibe]);

    const row = el("a", { class: "item", href: p.url }, [left, tag]);
    mount.appendChild(row);
  });
}

async function renderProducts() {
  const mount = document.querySelector("[data-products]");
  if (!mount) return;

  const data = await loadJSON("/data/products.json");
  mount.innerHTML = "";

  data.products.forEach((p) => {
    const card = el("div", { class: "card" }, [
      el("h2", {}, [p.name]),
      el("p", { class: "small" }, [p.blurb]),
      el("div", { class: "pill-row" }, [
        el("span", { class: "pill" }, [`format: ${p.format}`]),
        el("span", { class: "pill" }, [`price: ${p.price}`]),
      ]),
      el("div", { class: "pill-row" }, [
        el("a", { class: "btn primary", href: p.buyLink, target: "_blank", rel: "noopener" }, ["buy now"]),
        el("a", { class: "btn", href: p.previewLink, target: "_blank", rel: "noopener" }, ["preview"]),
      ]),
    ]);
    mount.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await Promise.all([renderPosts(), renderProducts()]);
  } catch (e) {
    console.error(e);
  }
});
