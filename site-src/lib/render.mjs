import MarkdownIt from 'markdown-it';
import { icons } from './icons.mjs';
import { renderMermaid } from './mermaid.mjs';

const OPEN = /^\{%\s*(hint|tabs|tab)\b([^%]*)%\}\s*$/;
const CLOSE = /^\{%\s*end(hint|tabs|tab)\s*%\}\s*$/;

const HINTS = {
  info: { label: 'Note', icon: 'info' },
  warning: { label: 'Warning', icon: 'warning' },
  danger: { label: 'Important', icon: 'danger' },
  success: { label: 'Good to know', icon: 'success' },
};

const attr = (s, name) => {
  const m = new RegExp(`${name}\\s*=\\s*"([^"]*)"`).exec(s);
  return m ? m[1] : '';
};

// Block rule for the GitBook blocks: hint, tabs and tab. The inner lines are parsed as
// ordinary Markdown, so lists, tables and code fences work inside them.
function gitbookBlocks(md) {
  md.block.ruler.before('fence', 'gitbook', (state, startLine, endLine, silent) => {
    if (state.sCount[startLine] - state.blkIndent >= 4) return false;
    const line = state.src.slice(state.bMarks[startLine] + state.tShift[startLine], state.eMarks[startLine]);
    const m = OPEN.exec(line);
    if (!m) return false;
    const kind = m[1];
    if (kind === 'tab' && state.parentType !== 'gb_tabs') return false;
    let depth = 1;
    let next = startLine + 1;
    for (; next < endLine; next++) {
      const l = state.src.slice(state.bMarks[next] + state.tShift[next], state.eMarks[next]);
      const o = OPEN.exec(l);
      if (o && o[1] === kind) depth++;
      const c = CLOSE.exec(l);
      if (c && c[1] === kind && --depth === 0) break;
    }
    if (next >= endLine) throw new Error(`Unclosed {% ${kind} %} block at line ${startLine + 1}`);
    if (silent) return true;
    const open = state.push(`gb_${kind}_open`, 'div', 1);
    open.block = true;
    open.map = [startLine, next + 1];
    open.meta = { style: attr(m[2], 'style') || 'info', title: attr(m[2], 'title') };
    const oldParent = state.parentType;
    const oldMax = state.lineMax;
    state.parentType = `gb_${kind}`;
    state.lineMax = next;
    state.md.block.tokenize(state, startLine + 1, next);
    state.parentType = oldParent;
    state.lineMax = oldMax;
    const close = state.push(`gb_${kind}_close`, 'div', -1);
    close.block = true;
    state.line = next + 1;
    return true;
  }, { alt: ['paragraph', 'reference', 'blockquote', 'list'] });
}

const textOf = (inline) =>
  (inline.children || [])
    .map((t) => (t.type === 'text' || t.type === 'code_inline' ? t.content : t.type === 'softbreak' ? ' ' : ''))
    .join('');

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-') || 'section';

export function createRenderer({ toHref }) {
  const md = new MarkdownIt({ html: false, linkify: false, typographer: false, breaks: false });
  md.use(gitbookBlocks);

  // ---- core passes, in order -------------------------------------------------
  md.core.ruler.push('docs_post', (state) => {
    const toks = state.tokens;
    const env = state.env;
    env.headings = [];
    const seen = new Map();

    // a rule line right before a second-level heading is replaced by the heading's own rule
    for (let i = toks.length - 2; i >= 0; i--) {
      if (toks[i].type === 'hr' && toks[i + 1].type === 'heading_open' && toks[i + 1].tag === 'h2') toks.splice(i, 1);
    }

    for (let i = 0; i < toks.length; i++) {
      const t = toks[i];

      // headings: ids and the outline
      if (t.type === 'heading_open') {
        // never skip a level: a third-level heading right under the title becomes a second-level
        // heading that keeps the look of a third-level one
        const orig = Number(t.tag.slice(1));
        const level = Math.min(orig, (env.lastLevel || 0) + 1);
        env.lastLevel = level;
        if (level !== orig) {
          t.tag = 'h' + level;
          t.attrJoin('class', 'hl-' + orig);
          for (let j = i + 1; j < toks.length; j++) if (toks[j].type === 'heading_close') { toks[j].tag = t.tag; break; }
        }
        const inline = toks[i + 1];
        const text = textOf(inline);
        let id = slugify(text);
        const n = seen.get(id) || 0;
        seen.set(id, n + 1);
        if (n) id = `${id}-${n}`;
        t.attrSet('id', id);
        t.meta = { id };
        env.headings.push({ level, id, text });
        if (level > 1) inline.children.push(Object.assign(new state.Token('html_inline', '', 0), {
          content: `<a class="anchor" href="#${id}" aria-label="Link to this section">${icons.link}</a>`,
        }));
      }

      // links: .md targets become page URLs; outside links get rel
      if (t.type === 'inline') {
        let inLink = 0;
        const inHeading = toks[i - 1] && toks[i - 1].type === 'heading_open';
        const out = [];
        for (const c of t.children) {
          if (c.type === 'link_open') {
            inLink++;
            const href = c.attrGet('href') || '';
            if (/^https?:\/\//.test(href)) {
              c.attrSet('rel', 'noopener noreferrer');
            } else {
              const mapped = toHref(href, env);
              if (mapped === null) throw new Error(`Unresolvable link "${href}" in ${env.source}`);
              c.attrSet('href', mapped);
            }
          }
          if (c.type === 'link_close') inLink--;
          // coin names carry their colour in running text (not in headings, links or code)
          if (c.type === 'text' && !inLink && !inHeading && /(?<!\w)((?:[Mm]icro-|[μµ])?NOID|ETH)\b/.test(c.content)) {
            for (const part of c.content.split(/(?<!\w)((?:[Mm]icro-|[μµ])?NOID|ETH)\b/)) {
              if (/^(?:[Mm]icro-|[μµ])?(NOID|ETH)$/.test(part)) {
                out.push(Object.assign(new state.Token('html_inline', '', 0), {
                  content: `<span class="coin coin-${part.replace(/^(?:[Mm]icro-|[μµ])/, '').toLowerCase()}">${part}</span>`,
                }));
              } else if (part) {
                const tt = new state.Token('text', '', 0);
                tt.content = part;
                out.push(tt);
              }
            }
          } else {
            out.push(c);
          }
        }
        t.children = out;
      }

      // task lists: "[ ] text" becomes an empty box, never raw brackets
      if (t.type === 'list_item_open' && toks[i + 1]?.type === 'paragraph_open' && toks[i + 2]?.type === 'inline') {
        const inline = toks[i + 2];
        const first = inline.children[0];
        const m = first && first.type === 'text' && /^\[( |x|X)\]\s+/.exec(first.content);
        if (m) {
          first.content = first.content.slice(m[0].length);
          t.attrJoin('class', 'task');
          const done = m[1] !== ' ';
          inline.children.unshift(Object.assign(new state.Token('html_inline', '', 0), {
            content: `<span class="task-box${done ? ' is-done' : ''}" aria-hidden="true"></span><span class="sr-only">${done ? 'Done' : 'To do'}: </span>`,
          }));
          // mark the parent list
          for (let j = i - 1; j >= 0; j--) {
            if (toks[j].type === 'bullet_list_open' && toks[j].level === t.level - 1) {
              toks[j].attrJoin('class', 'tasks');
              break;
            }
          }
        }
      }
    }

    // tables: header labels for the narrow layout, roles, a scroll wrapper
    for (let i = 0; i < toks.length; i++) {
      if (toks[i].type !== 'table_open') continue;
      const labels = [];
      let j = i;
      for (; j < toks.length && toks[j].type !== 'table_close'; j++) {
        if (toks[j].type === 'th_open') labels.push(textOf(toks[j + 1]));
      }
      toks[i].attrSet('role', 'table');
      if (labels.length <= 2) toks[i].attrJoin('class', 'two-col');
      let col = 0;
      for (let k = i; k < j; k++) {
        const tk = toks[k];
        if (tk.type === 'tr_open') {
          col = 0;
          tk.attrSet('role', 'row');
        }
        if (tk.type === 'th_open') {
          tk.attrSet('role', 'columnheader');
          tk.attrSet('scope', 'col');
        }
        if (tk.type === 'td_open') {
          tk.attrSet('role', 'cell');
          tk.attrSet('data-label', labels[col] || '');
          col++;
        }
      }
    }
  });

  // ---- renderers -------------------------------------------------------------
  const r = md.renderer.rules;

  r.gb_hint_open = (tokens, idx) => {
    const { style } = tokens[idx].meta;
    const h = HINTS[style] || HINTS.info;
    const key = HINTS[style] ? style : 'info';
    return `<aside class="hint hint-${key}" role="note"><span class="hint-icon">${icons[h.icon]}</span><div class="hint-body"><span class="sr-only">${h.label}: </span>`;
  };
  r.gb_hint_close = () => '</div></aside>\n';
  r.gb_tabs_open = () => '<div class="tabs" data-tabs>\n';
  r.gb_tabs_close = () => '</div>\n';
  r.gb_tab_open = (tokens, idx) => {
    const title = md.utils.escapeHtml(tokens[idx].meta.title);
    return `<section class="tab-panel" data-tab="${title}" aria-label="${title}"><p class="tab-title">${title}</p>\n`;
  };
  r.gb_tab_close = () => '</section>\n';

  r.fence = (tokens, idx, options, env) => {
    const t = tokens[idx];
    const lang = (t.info || '').trim().split(/\s+/)[0];
    if (lang === 'mermaid') {
      const html = renderMermaid(t.content);
      if (html) return html + '\n';
    }
    const code = t.content.replace(/\n$/, '');
    const oneLine = !code.includes('\n') ? ' is-line' : '';
    return `<figure class="code${oneLine}"><pre tabindex="0"><code${lang ? ` class="language-${md.utils.escapeHtml(lang)}"` : ''}>${md.utils.escapeHtml(code)}</code></pre></figure>\n`;
  };

  r.table_open = (tokens, idx, options, env, self) => `<div class="table-wrap"><table${self.renderAttrs(tokens[idx])}>\n`;
  r.table_close = () => '</table></div>\n';

  return {
    parse: (src, env) => md.parse(src, env),
    render: (tokens, env) => md.renderer.render(tokens, md.options, env),
    md,
  };
}
