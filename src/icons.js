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

icons.close = svg('<path d="M6 6l12 12M18 6L6 18"/>', 20);
icons.trash = svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>', 20);
icons.chevron = svg('<path d="M6 9l6 6 6-6"/>', 20);
icons.next = svg('<path d="M9 6l6 6-6 6"/>', 20);
icons.download = svg('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', 22);
icons.upload = svg('<path d="M12 15V4M7 9l5-5 5 5M5 20h14"/>', 22);
icons.sheet = svg('<path d="M5 4h14v16H5zM5 10h14M5 15h14M10 4v16"/>', 22);
