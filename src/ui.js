import { esc } from './format.js';

export function dialog({ title, text = '', actions }) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `<div class="dialog" role="alertdialog" aria-label="${esc(title)}">
      <h2>${esc(title)}</h2>
      ${text ? `<p>${esc(text)}</p>` : ''}
      ${actions.map((a, i) => `<button class="btn ${a.kind || 'dark'}" data-i="${i}">${esc(a.label)}</button>`).join('')}
    </div>`;
    overlay.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      overlay.remove();
      resolve(actions[btn.dataset.i].value);
    });
    document.body.appendChild(overlay);
  });
}

export function confirmDelete(title, text) {
  return dialog({
    title,
    text,
    actions: [
      { label: 'Cancel', value: false, kind: 'dark' },
      { label: 'Yes, delete', value: true, kind: 'danger' },
    ],
  });
}

export function toast(message) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}
