'use strict';
/* Featured editorial carousel: authentic existing portfolio assets, no auto-play. */
(() => {
  const stage = document.getElementById('featured-stage');
  const slider = document.getElementById('featured-slider');
  const prev = document.getElementById('featured-prev');
  const next = document.getElementById('featured-next');
  const index = document.getElementById('featured-index');
  if (!stage || !slider || !prev || !next || !index) return;
  let items = [];
  let active = 0;
  const node = (tag, cls, value) => { const e = document.createElement(tag); if(cls)e.className=cls;if(value!==undefined)e.textContent=value;return e; };
  function render() {
    const p = items[active];
    const article = node('article', 'featured-slide');
    article.setAttribute('aria-roledescription','slide');
    article.setAttribute('aria-label', (active+1)+' dari '+items.length+': '+p.title);
    const img = node('img','featured-image');
    img.src = p.cover; img.alt = p.alt || ('Visual proyek '+p.title);
    img.decoding = 'async'; img.loading = active === 0 ? 'eager' : 'lazy';
    const shade = node('div','featured-shade'); shade.setAttribute('aria-hidden','true');
    const copy = node('div','featured-copy');
    const kicker = node('span','featured-kicker',(p.label || 'Selected work')+(p.year ? ' / '+p.year : ''));
    const heading = node('h3','',p.title);
    const summary = node('p','',p.summary || p.subtitle || 'Explore this project from the HDRG portfolio.');
    const link = node('a','featured-cta','View project ↗');
    link.href = './project.html?id='+encodeURIComponent(p.id);
    copy.append(kicker,heading,summary,link);
    article.append(img,shade,copy);stage.replaceChildren(article);
    index.textContent = String(active+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');
    prev.disabled = items.length < 2;next.disabled = items.length < 2;
  }
  prev.disabled = true; next.disabled = true;
  const move = step => { if (items.length < 2) return; active = (active+step+items.length)%items.length;render(); };
  prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
  slider.tabIndex=0;
  slider.addEventListener('keydown',event=>{
    if(event.target!==slider)return;
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}
  });
  let touchStart = null;
  slider.addEventListener('touchstart', e => {
    const touch = e.touches.length === 1 ? e.touches[0] : null;
    touchStart = touch ? {x: touch.screenX, y: touch.screenY} : null;
  }, {passive: true});
  slider.addEventListener('touchcancel', () => { touchStart = null; }, {passive: true});
  slider.addEventListener('touchend', e => {
    const touch = e.changedTouches[0];
    if (!touchStart || !touch) return;
    const dx = touch.screenX - touchStart.x;
    const dy = touch.screenY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
  }, {passive: true});
  const load = window.HDRGCatalog && typeof window.HDRGCatalog.then === 'function'
    ? window.HDRGCatalog
    : Promise.resolve({projects: window.HDRG?.projects || []});
  load.then(catalog => {
    items = (Array.isArray(catalog?.projects) ? catalog.projects : [])
      .filter(p => p && p.title && p.cover && p.id).slice(0, 4);
    if (!items.length) { slider.closest('.featured-section')?.setAttribute('hidden', ''); return; }
    render();
  }).catch(() => { slider.closest('.featured-section')?.setAttribute('hidden', ''); });
})();
