// Builds the documentation site from the Markdown pages one folder up.
// Usage: node build.mjs        (writes ../_site)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRenderer } from './lib/render.mjs';
import { icons, mark } from './lib/icons.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const OUT = path.join(ROOT, '_site');

// Where the site is served. The 404 page is the only one that needs the absolute base path,
// because the host serves it from any depth; every other link is relative.
const ORIGIN = 'https://00para.github.io';
const BASE = '/noid-swap-docs/';
const LINKS = { github: 'https://github.com/00Para/noid-swap', x: 'https://x.com/No1dSwap' };
const SITE_NAME = 'No1d Swap Docs';

const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "font-src 'self'",
  "img-src 'self'",
  "connect-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---- the menu: SUMMARY.md ----------------------------------------------------
function readSummary() {
  const lines = fs.readFileSync(path.join(ROOT, 'SUMMARY.md'), 'utf8').split(/\r?\n/);
  const sections = [];
  for (const line of lines) {
    let m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) {
      sections.push({ title: m[1], pages: [] });
      continue;
    }
    m = /^\s*[*-]\s+\[(.+)\]\(([^)]+\.md)\)\s*$/.exec(line);
    if (m && sections.length) sections[sections.length - 1].pages.push({ title: m[1], src: m[2] });
  }
  const pages = [];
  for (const s of sections) {
    for (const p of s.pages) {
      p.section = s.title;
      p.slug = p.src === 'README.md' ? '' : p.src.replace(/\.md$/, '') + '/';
      p.depth = p.slug ? p.slug.split('/').filter(Boolean).length : 0;
      p.rel = '../'.repeat(p.depth);
      if (!fs.existsSync(path.join(ROOT, p.src))) throw new Error(`SUMMARY lists a missing file: ${p.src}`);
      pages.push(p);
    }
  }
  return { sections, pages };
}

const { sections, pages } = readSummary();
const bySrc = new Map(pages.map((p) => [p.src, p]));

function toHref(href, env) {
  if (/^(mailto:|tel:)/.test(href)) return href;
  const [p, hash] = href.split('#');
  if (!p) return href; // same-page anchor
  const target = path.posix.normalize(path.posix.join(path.posix.dirname(env.source), p));
  const page = bySrc.get(target);
  if (!page) return null;
  return (env.rel + page.slug || './') + (hash ? `#${hash}` : '');
}

const renderer = createRenderer({ toHref });

// ---- helpers -------------------------------------------------------------------
const plain = (inlineTokens) =>
  (inlineTokens || [])
    .map((t) => (t.type === 'text' || t.type === 'code_inline' ? t.content : t.type === 'softbreak' ? ' ' : ''))
    .join('');

function blockText(tokens, from, to) {
  const out = [];
  for (let i = from; i < to; i++) {
    const t = tokens[i];
    if (t.type === 'inline') out.push(plain(t.children));
    if (t.type === 'fence') out.push(t.content.replace(/\s+/g, ' ').trim());
  }
  return out.join(' ').replace(/\s+/g, ' ').trim();
}

// ---- the home page's picture: two locks on one clock --------------------------------
const heroFigure = `
<figure class="twolegs" role="img" aria-label="Two locks on one clock. Alice's NOID lock on Parano1d runs until the deadline D. Bob's ETH lock on Ethereum starts later and ends sooner, at T_reveal. The secret becomes public once, on Ethereum, between the two.">
  <div class="tl-grid" aria-hidden="true">
    <div class="tl-name"><span class="coin coin-noid">NOID</span><small>on Parano1d</small></div>
    <div class="tl-lane tl-lane-noid">
      <span class="tl-say tl-say-start">Alice locks</span>
      <span class="tl-line"></span>
      <span class="tl-end">D</span>
    </div>
    <div class="tl-name tl-name-mid"><span class="tl-secret-name">secret</span></div>
    <div class="tl-lane tl-lane-mid">
      <span class="tl-stem"></span>
      <span class="tl-diamond"></span>
      <span class="tl-say tl-say-reveal">revealed on Ethereum</span>
    </div>
    <div class="tl-name"><span class="coin coin-eth">ETH</span><small>on Ethereum</small></div>
    <div class="tl-lane tl-lane-eth">
      <span class="tl-say tl-say-start">Bob locks</span>
      <span class="tl-line"></span>
      <span class="tl-end">T_reveal</span>
    </div>
    <div class="tl-name tl-name-clock"><small>time</small></div>
    <div class="tl-lane tl-lane-clock"><span class="tl-clock"></span></div>
  </div>
  <figcaption>Ethereum's deadline always expires well before Parano1d's deadline.</figcaption>
</figure>`;

// ---- page template -----------------------------------------------------------------
function navHtml(current, rel) {
  const secs = sections
    .map((s, i) => {
      const items = s.pages
        .map((p) => {
          const href = rel + p.slug || './';
          const here = p === current;
          return `<li><a href="${href || './'}"${here ? ' aria-current="page"' : ''}>${esc(p.title)}</a></li>`;
        })
        .join('');
      return `<div class="nav-group"><p class="nav-sec" id="nav-sec-${i}">${esc(s.title)}</p><ul aria-labelledby="nav-sec-${i}">${items}</ul></div>`;
    })
    .join('\n');
  return `<nav id="site-nav" class="sidenav" aria-label="Documentation">
  <div class="sidenav-bar"><a class="sidenav-close" href="#main">${icons.close}<span>Close menu</span></a></div>
  ${secs}
  <div class="nav-group nav-ext"><p class="nav-sec" id="nav-sec-ext">Project</p><ul aria-labelledby="nav-sec-ext">
    <li><a href="${LINKS.github}" rel="noopener noreferrer">Source on GitHub</a></li>
    <li><a href="${LINKS.x}" rel="noopener noreferrer">Updates on X</a></li>
  </ul></div>
</nav>`;
}

function outlineHtml(headings) {
  const items = headings.filter((h) => h.level === 2 || h.level === 3);
  if (items.length < 2) return '';
  const lis = items
    .map((h) => `<li class="ol-l${h.level}"><a href="#${h.id}">${esc(h.text)}</a></li>`)
    .join('');
  return `<aside class="outline" aria-label="On this page"><p class="outline-title">On this page</p><ul>${lis}</ul></aside>`;
}

function pager(i, rel) {
  const prev = pages[i - 1];
  const next = pages[i + 1];
  const cell = (p, dir) =>
    p
      ? `<a class="pager-${dir}" href="${rel + p.slug || './'}" rel="${dir === 'prev' ? 'prev' : 'next'}"><span class="pager-dir">${dir === 'prev' ? 'Previous' : 'Next'}</span><span class="pager-title">${esc(p.title)}</span></a>`
      : '<span></span>';
  return `<nav class="pager" aria-label="Previous and next page">${cell(prev, 'prev')}${cell(next, 'next')}</nav>`;
}

function layout({ page, index, title, description, article, headings }) {
  const rel = page ? page.rel : '';
  const home = rel || './';
  const canonical = page ? `${ORIGIN}${BASE}${page.slug}` : `${ORIGIN}${BASE}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${esc(CSP)}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#050908">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${page ? `<link rel="canonical" href="${canonical}">` : ''}
<link rel="icon" href="${rel}assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="${rel}assets/fonts/SpaceGrotesk-wght.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${rel}assets/style.css">
<script src="${rel}assets/search-index.js" defer></script>
<script src="${rel}assets/site.js" defer></script>
</head>
<body data-root="${rel}">
<a class="skip" href="#main">Skip to content</a>
<header class="topbar">
  <div class="topbar-in">
    <a class="brand" href="${home}" aria-label="${SITE_NAME}, home">${mark()}<span class="brand-name">No1d Swap</span><span class="brand-docs">Docs</span></a>
    <div class="top-actions">
      <button type="button" class="search-btn" data-search hidden aria-label="Search the docs">${icons.search}<span class="search-label">Search</span><kbd>/</kbd></button>
      <a class="top-link" href="${LINKS.github}" rel="noopener noreferrer">GitHub</a>
      <a class="top-link" href="${LINKS.x}" rel="noopener noreferrer">X</a>
      <a class="menu-btn" href="#site-nav" aria-controls="site-nav" aria-expanded="false">${icons.menu}<span>Menu</span></a>
    </div>
  </div>
</header>
<div class="shell">
${navHtml(page, rel)}
<main id="main" class="main" tabindex="-1">
  <article class="prose${page && !page.slug ? ' is-home' : ''}">
${article}
  </article>
  ${index >= 0 ? pager(index, rel) : ''}
  <footer class="foot">
    <p>These pages load nothing from other sites: no analytics, no web-font service, no scripts from elsewhere. The fonts are Space Grotesk and JetBrains Mono under the SIL Open Font License (<a href="${rel}assets/fonts/SpaceGrotesk-OFL.txt">Space Grotesk</a>, <a href="${rel}assets/fonts/JetBrainsMono-OFL.txt">JetBrains Mono</a>).</p>
  </footer>
</main>
${outlineHtml(headings || [])}
</div>
</body>
</html>
`;
}

// ---- build -----------------------------------------------------------------------------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync(path.join(HERE, 'assets'), path.join(OUT, 'assets'), { recursive: true });
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

const searchIndex = [];

pages.forEach((page, i) => {
  const src = fs.readFileSync(path.join(ROOT, page.src), 'utf8');
  const env = { source: page.src, rel: page.rel };
  const tokens = renderer.parse(src, env);

  // title and lead
  const h1i = tokens.findIndex((t) => t.type === 'heading_open' && t.tag === 'h1');
  const h1 = h1i >= 0 ? plain(tokens[h1i + 1].children) : page.title;
  let leadEnd = -1;
  if (h1i >= 0 && tokens[h1i + 3]?.type === 'paragraph_open') {
    tokens[h1i + 3].attrJoin('class', 'lead');
    leadEnd = h1i + 5;
  }
  const descTok = tokens.find((t, k) => t.type === 'inline' && tokens[k - 1]?.type === 'paragraph_open');
  let description = descTok ? plain(descTok.children) : '';
  if (description.length > 180) description = description.slice(0, 177).replace(/\s+\S*$/, '') + '...';

  let article;
  if (!page.slug && leadEnd > 0) {
    article =
      renderer.render(tokens.slice(0, leadEnd), env) + heroFigure + '\n' + renderer.render(tokens.slice(leadEnd), env);
  } else {
    article = renderer.render(tokens, env);
  }

  const title = page.slug ? `${h1} - ${SITE_NAME}` : SITE_NAME;
  const html = layout({ page, index: i, title, description, article, headings: env.headings });
  const outDir = path.join(OUT, page.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);

  // search: one entry per heading section
  const sectionsOut = [];
  let cur = { h: h1, a: '', x: [] };
  for (let k = 0; k < tokens.length; k++) {
    const t = tokens[k];
    if (t.type === 'heading_open' && t.tag !== 'h1') {
      sectionsOut.push(cur);
      cur = { h: plain(tokens[k + 1].children), a: t.meta.id, x: [] };
      k += 2;
      continue;
    }
    if (t.type === 'inline' && tokens[k - 1]?.type !== 'heading_open') cur.x.push(plain(t.children));
    if (t.type === 'fence' && !/^mermaid/.test(t.info)) cur.x.push(t.content.replace(/\s+/g, ' ').trim());
  }
  sectionsOut.push(cur);
  searchIndex.push({
    t: page.title,
    u: page.slug,
    s: sectionsOut
      .filter((s) => s.h || s.x.length)
      .map((s) => ({ h: s.h, a: s.a, x: s.x.join(' ').replace(/\s+/g, ' ').trim() })),
  });
});

fs.writeFileSync(
  path.join(OUT, 'assets', 'search-index.js'),
  `window.NOID_DOCS_INDEX=${JSON.stringify(searchIndex)};\n`,
);

// 404: absolute base path, because the host serves it from any depth
{
  const article = `<h1>Page not found</h1>
<p class="lead">This address does not match a page in the docs. It may have moved, or the link may have a typo.</p>
<p><a href="${BASE}">Go to the start page</a>, or pick a page from the menu.</p>`;
  const page404 = layout({ page: null, index: -1, title: `Page not found - ${SITE_NAME}`, description: 'This page does not exist.', article, headings: [] });
  const abs = page404
    .replace(/(href|src)="assets\//g, `$1="${BASE}assets/`)
    .replace(/href="\.\/"/g, `href="${BASE}"`)
    .replace(/<nav id="site-nav"[\s\S]*?<\/nav>/, (nav) => navHtml(null, BASE));
  fs.writeFileSync(path.join(OUT, '404.html'), abs.replace(/data-root=""/, `data-root="${BASE}"`));
}

console.log(`Built ${pages.length} pages into ${path.relative(process.cwd(), OUT) || OUT}`);
