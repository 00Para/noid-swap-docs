// Draws the two kinds of diagram the pages use (a sequence diagram and a left-to-right
// chain) as plain HTML and CSS at build time, so no script and no outside request is needed.
// Anything else falls back to a code block (returns null).

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function sequence(lines) {
  const lanes = []; // { id, alias, short }
  const byId = new Map();
  const msgs = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line === 'sequenceDiagram') continue;
    let m = /^participant\s+(\w+)(?:\s+as\s+(.+))?$/.exec(line);
    if (m) {
      const alias = (m[2] || m[1]).trim();
      const lane = { id: m[1], alias, short: alias.replace(/\s*\(.*\)\s*$/, '') };
      byId.set(lane.id, lanes.length);
      lanes.push(lane);
      continue;
    }
    m = /^(\w+)\s*(-->>|->>|-->|->)\s*(\w+)\s*:\s*(.+)$/.exec(line);
    if (m && byId.has(m[1]) && byId.has(m[3])) {
      msgs.push({ from: byId.get(m[1]), to: byId.get(m[3]), text: m[4].trim() });
      continue;
    }
    return null; // something this drawing does not know
  }
  if (lanes.length < 2 || lanes.length > 4 || !msgs.length) return null;

  const laneClass = (l) => (/^parano1d$/i.test(l.short) ? ' is-noid' : /^ethereum$/i.test(l.short) ? ' is-eth' : '');
  const head = lanes
    .map((l) => `<span class="seq-lane${laneClass(l)}" title="${esc(l.alias)}">${esc(l.short)}</span>`)
    .join('');
  const rows = msgs
    .map((m) => {
      const self = m.from === m.to;
      const lo = Math.min(m.from, m.to);
      const dir = m.to > m.from ? 'r' : 'l';
      const tint = /^parano1d$/i.test(lanes[m.to].short) ? ' to-noid' : /^ethereum$/i.test(lanes[m.to].short) ? ' to-eth' : '';
      const track = self
        ? `<span class="seq-track s${m.from}${tint}" aria-hidden="true"><i class="seq-dot"></i><i class="seq-self"></i></span>`
        : `<span class="seq-track f${m.from} a${lo} w${Math.abs(m.to - m.from)} ${dir}${tint}" aria-hidden="true"><i class="seq-dot"></i><i class="seq-line"></i></span>`;
      const who = self ? `${lanes[m.from].short}, to itself` : `${lanes[m.from].short} to ${lanes[m.to].short}`;
      return `<li class="seq-row">${track}<p class="seq-text"><span class="sr-only">${esc(who)}: </span>${esc(m.text)}</p></li>`;
    })
    .join('');
  return (
    `<figure class="diagram seq n${lanes.length}"><div class="seq-head" aria-hidden="true">${head}</div>` +
    `<ol class="seq-rows">${rows}</ol></figure>`
  );
}

function chain(lines) {
  const nodes = new Map();
  const order = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || /^flowchart\b|^graph\b/.test(line)) continue;
    const parts = line.split(/\s*-->\s*/);
    for (const p of parts) {
      const m = /^(\w+)(?:\["([^"]*)"\])?$/.exec(p.trim());
      if (!m) return null;
      if (m[2] !== undefined) nodes.set(m[1], m[2]);
      if (!order.includes(m[1])) order.push(m[1]);
    }
  }
  if (order.length < 2 || order.some((id) => !nodes.has(id))) return null;
  const items = order
    .map((id) => {
      const label = nodes.get(id);
      const m = /^(.*?)\s*(\([^()]*\))\s*$/.exec(label);
      const main = m ? m[1] : label;
      const note = m ? m[2] : '';
      const alt = /refund opens/i.test(label) ? ' alt' : '';
      return `<li class="chain-item${alt}"><span class="chain-main">${esc(main)}</span>${note ? ` <span class="chain-note">${esc(note)}</span>` : ''}</li>`;
    })
    .join('');
  return `<figure class="diagram chain"><ol class="chain-list">${items}</ol></figure>`;
}

export function renderMermaid(src) {
  const lines = src.split(/\r?\n/);
  const first = lines.find((l) => l.trim());
  if (!first) return null;
  if (/^sequenceDiagram/.test(first.trim())) return sequence(lines);
  if (/^(flowchart|graph)\b/.test(first.trim())) return chain(lines);
  return null;
}
