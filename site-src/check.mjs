// Checks the built site: every internal link and anchor resolves, nothing from the source
// syntax leaks into the pages, no outside request is possible, headings are in order.
// Usage: node check.mjs   (after node build.mjs)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, '..', '_site');
const BASE = '/noid-swap-docs/';

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else files.push(p);
  }
})(OUT);
const htmls = files.filter((f) => f.endsWith('.html'));

const problems = [];
const bad = (f, msg) => problems.push(`${path.relative(OUT, f)}: ${msg}`);
const ids = new Map();
for (const f of htmls) {
  const s = fs.readFileSync(f, 'utf8');
  ids.set(f, new Set([...s.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

let linkCount = 0;
for (const f of htmls) {
  const s = fs.readFileSync(f, 'utf8');
  const is404 = path.basename(f) === '404.html';

  // links and files
  for (const m of s.matchAll(/<(a|link|script|img)\b[^>]*?\s(href|src)="([^"]*)"/g)) {
    const [, tag, , raw] = m;
    linkCount++;
    if (/^https?:\/\//.test(raw)) {
      if (tag === 'link' && /rel="canonical"/.test(m[0])) continue;
      if (tag !== 'a') bad(f, `outside resource loaded by <${tag}>: ${raw}`);
      continue;
    }
    if (/^(mailto:|tel:)/.test(raw)) continue;
    const [p, hash] = raw.split('#');
    let target;
    if (!p) target = f;
    else if (is404 && p.startsWith(BASE)) target = path.join(OUT, p.slice(BASE.length));
    else if (is404) { bad(f, `404 page uses a relative link: ${raw}`); continue; }
    else target = path.resolve(path.dirname(f), p);
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    if (!fs.existsSync(target)) { bad(f, `broken link: ${raw}`); continue; }
    if (hash && target.endsWith('.html') && !ids.get(target)?.has(hash)) bad(f, `missing anchor: ${raw}`);
  }
  for (const m of s.matchAll(/url\(([^)]+)\)/g)) bad(f, `url() in HTML: ${m[1]}`);

  // CSP-safe: no inline script, style element or style attribute
  if (/<script(?![^>]*\ssrc=)/.test(s)) bad(f, 'inline <script>');
  if (/<style\b/.test(s)) bad(f, 'inline <style>');
  if (/\sstyle="/.test(s)) bad(f, 'style attribute');
  if (/\son[a-z]+="/.test(s)) bad(f, 'inline event handler');
  if (!/Content-Security-Policy/.test(s)) bad(f, 'no CSP meta');
  if (/name="generator"/i.test(s)) bad(f, 'generator meta');

  // leaks of the source syntax into the text
  const text = s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<pre[\s\S]*?<\/pre>/g, '').replace(/<[^>]+>/g, ' ');
  for (const [re, what] of [
    [/\{%|%\}/, 'GitBook block syntax'],
    [/\.md\)/, '".md)" link text'],
    [/\]\(/, 'raw Markdown link'],
    [/```/, 'code fence'],
    [/\*\*\S/, 'raw bold markers'],
    [/\|\s*:?-{3,}/, 'raw table rule'],
    [/sequenceDiagram|flowchart LR/, 'diagram source'],
    [/^#{1,6}\s/m, 'raw heading marker'],
  ]) {
    if (re.test(text)) bad(f, `leak: ${what}`);
  }

  // headings in order, one h1
  const hs = [...s.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
  if (hs.filter((h) => h === 1).length !== 1) bad(f, `expected one h1, found ${hs.filter((h) => h === 1).length}`);
  for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) bad(f, `heading level jumps from h${hs[i - 1]} to h${hs[i]}`);
  if (!/<html lang="en">/.test(s)) bad(f, 'missing lang');
  if (!/<a class="skip"/.test(s)) bad(f, 'missing skip link');
  if (/<img\b(?![^>]*\salt=)/.test(s)) bad(f, 'img without alt');
  const dup = [...(s.match(/\sid="([^"]+)"/g) || [])];
  if (new Set(dup).size !== dup.length) bad(f, 'duplicate ids');
}

// the stylesheet and script must not reach outside either
for (const f of files.filter((x) => /\.(css|js)$/.test(x))) {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/(?:https?:)?\/\/[a-z0-9.-]+\.[a-z]{2,}[^\s"')]*/gi)) {
    if (!/\/\/\s*$/.test(m[0]) && !/w3\.org/.test(m[0])) bad(f, `outside URL in asset: ${m[0]}`);
  }
}

// no local paths in the output
for (const f of files.filter((x) => /\.(html|css|js|svg|txt)$/.test(x))) {
  if (/[A-Za-z]:[\\/]Users[\\/]/.test(fs.readFileSync(f, 'utf8'))) bad(f, 'local path in output');
}

console.log(`${htmls.length} pages, ${linkCount} links and files checked.`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log(' - ' + p);
  process.exit(1);
}
console.log('All internal links and anchors resolve; no leaks; no outside requests.');
