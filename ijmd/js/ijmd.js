/* ═══════════════════════════════════════════════════════════
   IJMD.ORG — Shared JavaScript (Mobile-First)
   Powered by VérgelAI
   ═══════════════════════════════════════════════════════════ */
'use strict';

/* ── THEME (desktop toggle + mobile button) ── */
(function(){
  const html  = document.documentElement;
  const btn   = document.getElementById('themeToggle');
  const lbl   = document.getElementById('themeLabel');
  const icon  = document.getElementById('themeIcon');
  const mbtn  = document.getElementById('mobileThemeBtn');
  const micon = document.getElementById('mobileThemeIcon');

  const SUN  = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
  const MOON = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;

  const saved = localStorage.getItem('ijmd-theme') ||
    (window.matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
  apply(saved);

  if(btn)  btn.addEventListener('click',  toggle);
  if(mbtn) mbtn.addEventListener('click', toggle);

  function toggle(){
    apply(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    localStorage.setItem('ijmd-theme', html.getAttribute('data-theme'));
  }

  function apply(t){
    html.setAttribute('data-theme', t);
    const dark = t === 'dark';
    if(btn)  btn.setAttribute('aria-checked', String(dark));
    if(lbl)  lbl.textContent  = dark ? 'Light Mode' : 'Dark Mode';
    if(icon)  icon.innerHTML  = dark ? SUN : MOON;
    if(micon) micon.innerHTML = dark ? SUN : MOON;
    // Update theme-color meta for browser chrome
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', dark ? '#000000' : '#faf8f3');
  }
})();

/* ── MARK ACTIVE BOTTOM TAB from URL ── */
(function(){
  const path  = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.bottom-tab').forEach(tab => {
    const href = (tab.getAttribute('href') || '').split('/').pop();
    if(href === path || (path === '' && href === 'index.html')){
      tab.classList.add('active');
    }
  });
  // Desktop sidebar
  document.querySelectorAll('.nav-item').forEach(li => {
    const a    = li.querySelector('a');
    if(!a) return;
    const href = (a.getAttribute('href') || '').split('/').pop();
    if(href === path || (path === '' && href === 'index.html')){
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
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected','true');
  });
  tab.addEventListener('keydown', e => {
    if(e.key==='Enter'||e.key===' '){e.preventDefault();tab.click()}
  });
});

/* ── SHOW MORE ABSTRACT ── */
document.querySelectorAll('.show-more').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const abs = btn.previousElementSibling;
    const exp = btn.getAttribute('aria-expanded') === 'true';
    abs.classList.toggle('abstract-clamp', exp);
    btn.textContent = exp ? 'Show more' : 'Show less';
    btn.setAttribute('aria-expanded', String(!exp));
  });
});

/* ── LIKE TOGGLE ── */
document.querySelectorAll('.action-btn.like').forEach(btn => {
  btn.addEventListener('click', () => {
    const span  = btn.querySelector('span');
    const liked = btn.classList.contains('liked');
    const base  = parseInt(btn.dataset.count || '0', 10);
    btn.classList.toggle('liked');
    if(span) span.textContent = fmt(liked ? base - 1 : base + 1);
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
document.querySelectorAll('.filter-bar').forEach(bar => {
  bar.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      bar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
});

/* ── COPY CITE ── */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const code = btn.closest('.cite-box')?.querySelector('.cite-code')?.textContent || '';
    navigator.clipboard?.writeText(code).then(() => {
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = orig, 2000);
    }).catch(() => {});
  });
});

/* ── UPLOAD AREA ── */
document.querySelectorAll('.upload-area').forEach(area => {
  const setFile = f => {
    if(!f) return;
    const lbl = area.querySelector('.upload-label');
    if(lbl) lbl.textContent = '✓ ' + f.name;
  };
  area.addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.pdf,.doc,.docx';
    inp.onchange = e => setFile(e.target.files[0]);
    inp.click();
  });
  area.addEventListener('dragover', e => { e.preventDefault(); area.style.borderColor='var(--accent)'; });
  area.addEventListener('dragleave', () => area.style.borderColor = '');
  area.addEventListener('drop', e => { e.preventDefault(); area.style.borderColor=''; setFile(e.dataTransfer.files[0]); });
});

/* ── COMPOSE AUTO-RESIZE ── */
document.querySelectorAll('.compose-input').forEach(el => {
  el.addEventListener('input', function(){ this.style.height='auto'; this.style.height=this.scrollHeight+'px'; });
});

/* ── LOAD MORE (simulate) ── */
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
    if(btn){
      btn.textContent='✓ Submitted! We\'ll be in touch within 48h.';
      btn.style.background='var(--green)'; btn.style.color='#000';
    }
  }, 1800);
});

/* ── SEARCH ── */
document.getElementById('exploreSearch')?.addEventListener('keydown', e => {
  if(e.key === 'Enter' && e.target.value.trim()){
    const lbl = document.querySelector('.results-label');
    if(lbl) lbl.textContent = `RESULTS FOR "${e.target.value.trim().toUpperCase()}"`;
  }
});

/* ── SWIPE TO SWITCH TABS (mobile) ── */
(function(){
  let startX = 0, startY = 0;
  const feed = document.querySelector('.main-feed') || document.querySelector('.main-content');
  if(!feed) return;
  feed.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, {passive:true});
  feed.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if(Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.6) return;
    const tabs = [...document.querySelectorAll('.feed-tab')];
    const cur  = tabs.findIndex(t => t.classList.contains('active'));
    const next = dx < 0 ? Math.min(cur + 1, tabs.length - 1) : Math.max(cur - 1, 0);
    if(next !== cur) tabs[next].click();
  }, {passive:true});
})();

/* ── UTIL ── */
function fmt(n){ return n >= 1000 ? (n/1000).toFixed(1).replace('.0','')+'k' : String(n); }
