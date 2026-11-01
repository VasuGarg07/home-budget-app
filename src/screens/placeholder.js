export function renderPlaceholder(el, name) {
  el.innerHTML = `<h1 class="title">${name[0].toUpperCase() + name.slice(1)}</h1><p class="muted">This screen is not built yet.</p>`;
}
