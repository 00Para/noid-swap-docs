// Small line icons on a 16 px grid, 1.5 px round stroke. Drawn for this site.
const wrap = (d) =>
  `<svg class="ic" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">${d}</svg>`;

export const icons = {
  info: wrap('<circle cx="8" cy="8" r="6.25"/><path d="M8 7.2v3.6"/><path d="M8 5.1v.1"/>'),
  warning: wrap('<path d="M8 2.2 14.2 13H1.8L8 2.2Z"/><path d="M8 6.6v3"/><path d="M8 11.4v.1"/>'),
  danger: wrap('<path d="M5.2 1.9h5.6l3.3 3.3v5.6l-3.3 3.3H5.2L1.9 10.8V5.2l3.3-3.3Z"/><path d="m6 6 4 4"/><path d="m10 6-4 4"/>'),
  success: wrap('<circle cx="8" cy="8" r="6.25"/><path d="m5.3 8.2 1.9 1.9 3.5-3.9"/>'),
  search: wrap('<circle cx="7.2" cy="7.2" r="4.6"/><path d="m10.6 10.6 3.2 3.2"/>'),
  menu: wrap('<path d="M2.5 4.5h11"/><path d="M2.5 8h11"/><path d="M2.5 11.5h11"/>'),
  close: wrap('<path d="m3.5 3.5 9 9"/><path d="m12.5 3.5-9 9"/>'),
  copy: wrap('<rect x="5.5" y="5.5" width="8" height="8" rx="1.6"/><path d="M10.5 5.5V4a1.6 1.6 0 0 0-1.6-1.6H4A1.6 1.6 0 0 0 2.4 4v4.9A1.6 1.6 0 0 0 4 10.5h1.5"/>'),
  check: wrap('<path d="m3.2 8.4 3.1 3.1 6.5-7"/>'),
  link: wrap('<path d="M6.6 9.4a2.6 2.6 0 0 0 3.7 0l2.2-2.2a2.6 2.6 0 0 0-3.7-3.7l-.6.6"/><path d="M9.4 6.6a2.6 2.6 0 0 0-3.7 0L3.5 8.8a2.6 2.6 0 0 0 3.7 3.7l.6-.6"/>'),
};

// The product's mark: two arcs (the two locks) around a diamond (the shared secret).
export const mark = (cls = 'mark') =>
  `<svg class="${cls}" viewBox="0 0 200 200" width="24" height="24" aria-hidden="true" focusable="false">` +
  '<path d="M105.16 26.18 A74 74 0 1 1 27.12 87.15" fill="none" stroke="#9fe870" stroke-width="24" stroke-linecap="round"/>' +
  '<path d="M135.32 81.22 A40 40 0 0 1 78.80 133.92" fill="none" stroke="#93a8ff" stroke-width="22" stroke-linecap="round"/>' +
  '<rect x="90" y="90" width="20" height="20" rx="2.6" transform="rotate(45 100 100)" fill="#e6edea"/></svg>';
