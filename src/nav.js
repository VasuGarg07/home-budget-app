import { icons } from './icons.js';

const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'reports', label: 'Reports' },
  { id: 'add', label: 'Add transaction', center: true },
  { id: 'categories', label: 'Categories' },
  { id: 'settings', label: 'Settings' },
];

export function navBar(active) {
  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.innerHTML = tabs
    .map((t) =>
      t.center
        ? `<a class="nav-add ripple" href="#${t.id}" aria-label="${t.label}">${icons.add}</a>`
        : `<a class="nav-item ripple${t.id === active ? ' active' : ''}" href="#${t.id}">${icons[t.id]}${t.label}</a>`
    )
    .join('');
  return nav;
}
