/* ═══════════════════════════════════════════════════════════
   IJMD.ORG — Shared JavaScript
   Powered by VérgelAI
   ═══════════════════════════════════════════════════════════ */
'use strict';

/* ── THEME ── */
(function(){
  const html = document.documentElement;
  const btn  = document.getElementById('themeToggle');
  const lbl  = document.getElementById('themeLabel');
  const icon = document.getElementById('themeIcon');
  if(!btn) return;

  const SUN = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
  const MOON = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;

  const saved = localStorage.getItem('ijmd-theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  apply(saved);

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    localStorage.setItem('ijmd-theme', next);
  });

  function apply(t){
    html.setAttribute('data-theme', t);
    const dark = t === 'dark';
    if(btn) btn.setAttribute('aria-checked', String(dark));
    if(lbl) lbl.textContent = dark ? 'Light Mode' : 'Dark Mode';
    if(icon) icon.innerHTML = dark ? SUN : MOON;
  }
})();

/* ── NAV: mark active page ── */
(function(){
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-item').forEach(li => {
    const a = li.querySelector('a');
    if(!a) return;
    const href = a.getAttribute('href')?.replace(/\/$/, '') || '';
    if(path === href || (href !== '' && href !== '/' && path.startsWith(href))){
      li.classList.add('active');
    } else {
      li.classList.remove('active');
    }
  });
})();

/* ── FEED TABS ── */
document.querySelectorAll('.feed-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    tab.closest('.feed-tabs').querySelectorAll('.feed-tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected','false');
      t.setAttribute('tabindex','-1');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected','true');
    tab.setAttribute('tabindex','0');
  });
  tab.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){e.preventDefault();tab.click()} });
});

/* ── SHOW MORE ABSTRACT ── */
document.querySelectorAll('.show-more').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const abs = btn.previousElementSibling;
    const exp = btn.getAttribute('aria-expanded')==='true';
    abs.classList.toggle('abstract-clamp', exp);
    btn.textContent = exp ? 'Show more' : 'Show less';
    btn.setAttribute('aria-expanded', String(!exp));
  });
  btn.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){e.preventDefault();btn.click()} });
});

/* ── LIKE TOGGLE ── */
document.querySelectorAll('.action-btn.like').forEach(btn => {
  btn.addEventListener('click', () => {
    const span = btn.querySelector('span');
    const liked = btn.classList.contains('liked');
    const base  = parseInt(btn.dataset.count || span?.textContent?.replace(/[^0-9]/g,'') || 0, 10);
    btn.classList.toggle('liked');
    if(span) span.textContent = fmt(liked ? base-1 : base+1);
    const path = btn.querySelector('path');
    if(path) path.setAttribute('fill', liked ? 'none' : 'var(--crimson)');
  });
});

/* ── SAVE TOGGLE ── */
document.querySelectorAll('.action-btn.save').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('saved');
    const path = btn.querySelector('path');
    if(path) path.setAttribute('fill', btn.classList.contains('saved') ? 'var(--accent)' : 'none');
  });
});

/* ── FOLLOW BUTTONS ── */
document.querySelectorAll('.follow-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const f = btn.classList.toggle('following');
    btn.textContent = f ? 'Following' : 'Follow';
    btn.setAttribute('aria-pressed', String(f));
  });
});

/* ── FILTER CHIPS ── */
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chip.closest('.filter-bar')?.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

/* ── COPY CITE ── */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const code = btn.closest('.cite-box')?.querySelector('.cite-code')?.textContent || '';
    navigator.clipboard.writeText(code).then(() => {
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = orig, 2000);
    });
  });
});

/* ── UPLOAD AREA ── */
document.querySelectorAll('.upload-area').forEach(area => {
  area.addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.pdf,.doc,.docx';
    inp.onchange = e => {
      const f = e.target.files[0];
      if(f){ const lbl = area.querySelector('.upload-label'); if(lbl) lbl.textContent = '✓ ' + f.name; }
    };
    inp.click();
  });
  area.addEventListener('dragover', e => { e.preventDefault(); area.style.borderColor='var(--accent)'; area.style.background='var(--accent-dim)'; });
  area.addEventListener('dragleave', () => { area.style.borderColor=''; area.style.background=''; });
  area.addEventListener('drop', e => {
    e.preventDefault(); area.style.borderColor=''; area.style.background='';
    const f = e.dataTransfer.files[0];
    if(f){ const lbl = area.querySelector('.upload-label'); if(lbl) lbl.textContent = '✓ ' + f.name; }
  });
});

/* ── COMPOSE AUTO-RESIZE ── */
document.querySelectorAll('.compose-input').forEach(el => {
  el.addEventListener('input', function(){ this.style.height='auto'; this.style.height=this.scrollHeight+'px'; });
});

/* ── LOAD MORE ── */
document.getElementById('loadMoreBtn')?.addEventListener('click', function(){
  const orig = this.textContent;
  this.textContent = 'Loading…'; this.style.opacity='.5'; this.style.pointerEvents='none';
  setTimeout(() => { this.textContent=orig; this.style.opacity=''; this.style.pointerEvents=''; }, 1400);
});

/* ── SUBMIT FORM ── */
document.getElementById('submitForm')?.addEventListener('submit', function(e){
  e.preventDefault();
  const btn = this.querySelector('.submit-form-btn');
  if(btn){ btn.textContent='Submitting…'; btn.disabled=true; }
  setTimeout(() => {
    if(btn){ btn.textContent='✓ Submitted! We\'ll be in touch within 48h.'; btn.style.background='var(--green)'; btn.style.color='#000'; }
  }, 1800);
});

/* ── SEARCH FORM ── */
document.getElementById('exploreSearch')?.addEventListener('keydown', e => {
  if(e.key==='Enter' && e.target.value.trim()){
    const lbl = document.querySelector('.results-label');
    if(lbl) lbl.textContent = `RESULTS FOR "${e.target.value.trim().toUpperCase()}"`;
  }
});

/* ── UTIL ── */
function fmt(n){
  if(n>=1000) return (n/1000).toFixed(1).replace('.0','')+'k';
  return String(n);
}
