/* Small progressive enhancements. The pages read fine without this file. No network requests. */
(function () {
  'use strict';
  var doc = document;
  doc.documentElement.classList.add('js');
  var root = doc.body.getAttribute('data-root') || '';

  var ICON = {
    copy: '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><rect x="5.5" y="5.5" width="8" height="8" rx="1.6"/><path d="M10.5 5.5V4a1.6 1.6 0 0 0-1.6-1.6H4A1.6 1.6 0 0 0 2.4 4v4.9A1.6 1.6 0 0 0 4 10.5h1.5"/></svg>',
    check: '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m3.2 8.4 3.1 3.1 6.5-7"/></svg>',
    search: '<svg class="ic" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" focusable="false"><circle cx="7.2" cy="7.2" r="4.6"/><path d="m10.6 10.6 3.2 3.2"/></svg>',
  };

  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { /* storage may be blocked; the page works without it */ }
    return null;
  }

  /* ---- announcements for screen readers ---- */
  var live = doc.createElement('div');
  live.className = 'sr-only';
  live.setAttribute('role', 'status');
  live.setAttribute('aria-live', 'polite');
  doc.body.appendChild(live);
  function say(t) { live.textContent = ''; window.setTimeout(function () { live.textContent = t; }, 30); }

  /* ---- copy ---- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = doc.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.className = 'sr-only';
      doc.body.appendChild(ta); ta.select();
      try { doc.execCommand('copy') ? resolve() : reject(); } catch (e) { reject(e); }
      doc.body.removeChild(ta);
    });
  }
  function copyButton(cls, label, getText) {
    var b = doc.createElement('button');
    b.type = 'button'; b.className = cls; b.setAttribute('aria-label', label); b.innerHTML = ICON.copy;
    b.addEventListener('click', function () {
      copyText(getText()).then(function () {
        b.classList.add('is-done'); b.innerHTML = ICON.check; say('Copied');
        window.setTimeout(function () { b.classList.remove('is-done'); b.innerHTML = ICON.copy; }, 1600);
      }, function () { say('Copy failed. Select the text and copy it by hand.'); });
    });
    return b;
  }
  doc.querySelectorAll('figure.code').forEach(function (fig) {
    var code = fig.querySelector('code');
    fig.appendChild(copyButton('copy', 'Copy code', function () { return code.textContent; }));
  });
  doc.querySelectorAll('.prose :not(pre) > code').forEach(function (code) {
    var t = code.textContent.trim();
    if (t.length >= 40 && /^[A-Za-z0-9+\/=_\-x]+$/.test(t)) {
      code.insertAdjacentElement('afterend', copyButton('copy-inline', 'Copy value', function () { return t; }));
    }
  });

  /* ---- tabs ---- */
  var groups = Array.prototype.slice.call(doc.querySelectorAll('[data-tabs]'));
  function osName() {
    var ua = navigator.userAgent || '';
    if (/Windows/i.test(ua)) return 'Windows';
    if (/Mac/i.test(ua)) return 'macOS';
    return '';
  }
  var pref = store('noid-docs-tab') || osName();
  var built = [];
  groups.forEach(function (group, gi) {
    var panels = Array.prototype.slice.call(group.querySelectorAll(':scope > .tab-panel'));
    if (panels.length < 2) return;
    group.classList.add('is-js');
    var list = doc.createElement('div');
    list.className = 'tablist'; list.setAttribute('role', 'tablist');
    var tabs = panels.map(function (p, i) {
      var b = doc.createElement('button');
      b.type = 'button'; b.className = 'tab'; b.setAttribute('role', 'tab');
      b.id = 'tab-' + gi + '-' + i; b.setAttribute('aria-controls', 'panel-' + gi + '-' + i);
      b.textContent = p.getAttribute('data-tab');
      p.id = 'panel-' + gi + '-' + i; p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', b.id);
      p.removeAttribute('aria-label');
      list.appendChild(b);
      return b;
    });
    group.insertBefore(list, group.firstChild);
    function select(i, focus) {
      tabs.forEach(function (b, k) {
        var on = k === i;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
        panels[k].hidden = !on;
      });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (b, i) {
      b.addEventListener('click', function () {
        select(i);
        pref = panels[i].getAttribute('data-tab').split(/\s+/)[0];
        store('noid-docs-tab', pref);
        built.forEach(function (o) { if (o.group !== group) o.pick(pref); });
      });
      b.addEventListener('keydown', function (e) {
        var n = tabs.length, k = -1;
        if (e.key === 'ArrowRight') k = (i + 1) % n;
        else if (e.key === 'ArrowLeft') k = (i + n - 1) % n;
        else if (e.key === 'Home') k = 0;
        else if (e.key === 'End') k = n - 1;
        if (k >= 0) { e.preventDefault(); select(k, true); }
      });
    });
    function pick(name) {
      for (var i = 0; i < panels.length; i++) {
        if (name && panels[i].getAttribute('data-tab').indexOf(name) === 0) { select(i); return; }
      }
      select(0);
    }
    built.push({ group: group, pick: pick });
    pick(pref);
  });

  /* ---- mobile menu ---- */
  var menuBtn = doc.querySelector('.menu-btn');
  var nav = doc.getElementById('site-nav');
  var html = doc.documentElement;
  function setNav(open) {
    html.classList.toggle('nav-open', open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function (e) { e.preventDefault(); setNav(!html.classList.contains('nav-open')); });
    nav.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a') : null;
      if (!a) return;
      if (a.classList.contains('sidenav-close')) e.preventDefault();
      setNav(false);
    });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && html.classList.contains('nav-open')) { setNav(false); menuBtn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth >= 900) setNav(false); });
  }
  var cur = nav && nav.querySelector('[aria-current="page"]');
  if (cur && window.innerWidth >= 900 && cur.scrollIntoView) {
    var r = cur.getBoundingClientRect();
    if (r.bottom > window.innerHeight - 40) cur.scrollIntoView({ block: 'center' });
  }

  /* ---- outline: mark the section being read ---- */
  var links = Array.prototype.slice.call(doc.querySelectorAll('.outline a'));
  if (links.length && 'IntersectionObserver' in window) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var heads = links.map(function (a) { return doc.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      var first = heads.filter(function (h) { return visible[h.id]; })[0];
      if (!first) {
        // none in the band: use the last heading above the band
        var above = heads.filter(function (h) { return h.getBoundingClientRect().top < 120; });
        first = above[above.length - 1];
      }
      links.forEach(function (a) { a.removeAttribute('aria-current'); });
      if (first && map[first.id]) map[first.id].setAttribute('aria-current', 'location');
    }, { rootMargin: '-72px 0px -65% 0px', threshold: 0 });
    heads.forEach(function (h) { io.observe(h); });
  }

  /* ---- search ---- */
  var data = window.NOID_DOCS_INDEX;
  var openers = doc.querySelectorAll('[data-search]');
  if (!data || !openers.length || typeof doc.createElement('dialog').showModal !== 'function') return;
  openers.forEach(function (b) { b.hidden = false; });

  var dlg = doc.createElement('dialog');
  dlg.className = 'search'; dlg.setAttribute('aria-label', 'Search the docs');
  dlg.innerHTML =
    '<div class="search-field">' + ICON.search +
    '<input type="search" placeholder="Search the docs" aria-label="Search the docs" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="false" aria-controls="search-results" aria-autocomplete="list"></div>' +
    '<ul class="search-results" id="search-results" role="listbox" aria-label="Results"></ul>' +
    '<div class="search-foot"><span>Up and down to move</span><span>Enter to open</span><span>Esc to close</span></div>';
  doc.body.appendChild(dlg);
  var input = dlg.querySelector('input');
  var out = dlg.querySelector('ul');
  var sel = -1;

  function norm(s) { return s.toLowerCase(); }
  function run(q) {
    var terms = norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    var hits = [];
    data.forEach(function (p) {
      var pt = norm(p.t);
      p.s.forEach(function (s) {
        var h = norm(s.h), x = norm(s.x), score = 0, ok = true;
        for (var i = 0; i < terms.length; i++) {
          var t = terms[i], inT = pt.indexOf(t) >= 0, inH = h.indexOf(t) >= 0, inX = x.indexOf(t) >= 0;
          if (!inT && !inH && !inX) { ok = false; break; }
          score += (inH ? 8 : 0) + (inT ? 3 : 0) + (inX ? 1 : 0);
        }
        if (ok) hits.push({ p: p, s: s, score: score + (s.a ? 0 : 2) });
      });
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    return hits.slice(0, 8).map(function (h) { h.terms = terms; return h; });
  }
  function snippet(text, terms) {
    var low = norm(text), at = -1;
    for (var i = 0; i < terms.length; i++) { var k = low.indexOf(terms[i]); if (k >= 0 && (at < 0 || k < at)) at = k; }
    if (at < 0) return text.slice(0, 110);
    var from = Math.max(0, at - 36);
    return (from > 0 ? '…' : '') + text.slice(from, from + 130) + (from + 130 < text.length ? '…' : '');
  }
  function marked(parent, text, terms) {
    var low = norm(text), pos = 0;
    while (pos < text.length) {
      var best = -1, len = 0;
      for (var i = 0; i < terms.length; i++) { var k = low.indexOf(terms[i], pos); if (k >= 0 && (best < 0 || k < best)) { best = k; len = terms[i].length; } }
      if (best < 0) break;
      parent.appendChild(doc.createTextNode(text.slice(pos, best)));
      var m = doc.createElement('mark'); m.textContent = text.slice(best, best + len); parent.appendChild(m);
      pos = best + len;
    }
    parent.appendChild(doc.createTextNode(text.slice(pos)));
  }
  function setSel(i) {
    var items = out.querySelectorAll('a');
    if (!items.length) { sel = -1; input.removeAttribute('aria-activedescendant'); return; }
    sel = (i + items.length) % items.length;
    items.forEach(function (a, k) { a.setAttribute('aria-selected', k === sel ? 'true' : 'false'); });
    input.setAttribute('aria-activedescendant', items[sel].id);
    items[sel].scrollIntoView({ block: 'nearest' });
  }
  function render() {
    var q = input.value.trim();
    out.textContent = '';
    if (!q) { input.setAttribute('aria-expanded', 'false'); sel = -1; return; }
    var hits = run(q);
    input.setAttribute('aria-expanded', hits.length ? 'true' : 'false');
    if (!hits.length) {
      var li = doc.createElement('li'); li.className = 'search-empty'; li.textContent = 'Nothing found for “' + q + '”.'; out.appendChild(li); sel = -1; return;
    }
    hits.forEach(function (h, i) {
      var li = doc.createElement('li'); li.setAttribute('role', 'presentation');
      var a = doc.createElement('a'); a.id = 'sr-' + i; a.setAttribute('role', 'option');
      a.href = root + h.p.u + (h.s.a ? '#' + h.s.a : '') || './';
      var t = doc.createElement('span'); t.className = 'sr-title'; marked(t, h.s.h || h.p.t, h.terms);
      var pg = doc.createElement('span'); pg.className = 'sr-page'; pg.textContent = h.s.a ? h.p.t : 'Page';
      var sn = doc.createElement('span'); sn.className = 'sr-snip'; marked(sn, snippet(h.s.x, h.terms), h.terms);
      a.appendChild(t); a.appendChild(pg); if (h.s.x) a.appendChild(sn);
      li.appendChild(a); out.appendChild(li);
    });
    setSel(0);
  }
  function open() { setNav(false); if (!dlg.open) dlg.showModal(); input.focus(); input.select(); }
  openers.forEach(function (b) { b.addEventListener('click', open); });
  input.addEventListener('input', render);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(sel + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(sel - 1); }
    else if (e.key === 'Enter') { var a = out.querySelectorAll('a')[sel]; if (a) { e.preventDefault(); window.location.href = a.href; } }
  });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  out.addEventListener('click', function () { dlg.close(); });
  doc.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    var typing = /INPUT|TEXTAREA|SELECT/.test(tag) || (e.target && e.target.isContentEditable);
    if ((e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) || ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey))) {
      e.preventDefault(); open();
    }
  });
})();
