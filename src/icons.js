const svg = (path, size = 24) =>
  `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

export const icons = {
  home: svg('<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>'),
  reports: svg('<path d="M4 20V12M10 20V5M16 20v-9M21 20H3"/>'),
  add: svg('<path d="M12 5v14M5 12h14"/>'),
  categories: svg('<path d="M3 4h8l9 9-7 7-10-10z"/><circle cx="7.5" cy="8.5" r="1"/>'),
  settings: svg('<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>'),
  up: svg('<path d="M12 19V5M6 11l6-6 6 6"/>', 20),
  down: svg('<path d="M12 5v14M6 13l6 6 6-6"/>', 20),
};
