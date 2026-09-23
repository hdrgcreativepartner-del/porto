'use strict';
(() => {
  const el = (tag, css, text) => { const node = document.createElement(tag); if (css) node.className = css; if (text !== undefined) node.textContent = text; return node; };
  const link = (href, label, css) => { const node = el('a', css, label); node.href = href; return node; };
  const root = document.querySelector('#case-content');
  const viewer = document.querySelector('#image-viewer');
  let images = [], current = 0, lastTrigger;
  function showImage(number) {
    current = (number + images.length) % images.length;
    const image = images[current];
    const preview = document.querySelector('#viewer-image');
    preview.src = image.src; preview.alt = image.alt; preview.className = image.className || '';
    document.querySelector('#viewer-count').textContent = (current + 1) + ' / ' + images.length;
    document.querySelector('#viewer-caption').textContent = image.caption || image.alt;
  }
  document.querySelector('#viewer-close').addEventListener('click', () => viewer.close());
  document.querySelector('#viewer-prev').addEventListener('click', () => showImage(current - 1));
  document.querySelector('#viewer-next').addEventListener('click', () => showImage(current + 1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showImage(current + 1); }
  });
  viewer.addEventListener('close', () => { document.body.classList.remove('modal-open'); lastTrigger?.focus({ preventScroll: true }); });

  window.HDRGCatalog.then(({ projects }) => {
    const id = new URLSearchParams(location.search).get('id');
    const project = projects.find(item => item.id === id);
    if (!project) {
      const empty = el('section', 'case-loading container');
      empty.append(el('h1', '', 'Proyek belum tersedia.'), el('p', '', 'Karya ini mungkin sudah dipindahkan atau belum dipublikasikan.'), link('./#work', '← Jelajahi karya lainnya', 'text-link'));
      root.replaceChildren(empty); document.title = 'Proyek belum tersedia — HDRG Creative Partner'; return;
    }
    images = project.images;
    document.title = project.title + ' — HDRG Creative Partner';
    document.querySelector('meta[name="description"]').content = project.summary || project.title;
    const intro = el('section', 'case-intro container');
    intro.append(el('p', 'eyebrow', '/ PROJECT STORY'));
    const heading = el('div', 'case-heading');
    const title = el('div'); title.append(el('h1', '', project.title));
    if (project.subtitle) title.append(el('p', 'case-subtitle', project.subtitle));
    const facts = el('dl', 'case-facts');
    [['Disiplin', project.label], ['Kategori', project.type], ['Klien / brand', project.client], ['Tahun', project.year]].forEach(([label, value]) => {
      if (!value) return;
      const item = el('div'); item.append(el('dt', '', label), el('dd', '', value)); facts.append(item);
    });
    heading.append(title, facts); intro.append(heading);
    const overview = el('div', 'case-overview');
    if (project.summary) overview.append(el('p', 'case-summary', project.summary));
    const detail = el('div');
    if (project.description) detail.append(el('p', '', project.description));
    if (project.scope.length) { const scope = el('ul', 'case-scope'); project.scope.forEach(item => scope.append(el('li', '', item))); detail.append(scope); }
    overview.append(detail); intro.append(overview);
    const gallery = el('section', 'case-gallery'); gallery.setAttribute('aria-label', 'Galeri ' + project.title);
    images.forEach((image, index) => {
      const figure = el('figure', 'case-figure');
      const button = el('button', 'case-image-button'); button.type = 'button'; button.setAttribute('aria-label', 'Perbesar gambar ' + (index + 1) + ': ' + image.alt);
      const img = el('img', image.className); img.src = image.src; img.alt = image.alt; img.loading = index === 0 ? 'eager' : 'lazy'; img.decoding = 'async';
      button.append(img, el('span', 'image-enlarge', '↗ Perbesar'));
      button.addEventListener('click', () => { lastTrigger = button; showImage(index); document.body.classList.add('modal-open'); viewer.showModal(); document.querySelector('#viewer-close').focus(); });
      figure.append(button);
      if (image.caption) figure.append(el('figcaption', '', image.caption));
      gallery.append(figure);
    });
    const outro = el('section', 'case-outro container');
    if (project.note) outro.append(el('p', 'case-note', project.note));
    const thanks = el('div', 'case-thanks'); thanks.append(el('span', 'eyebrow', '/ YOUR NEXT PROJECT'), el('h2', '', 'Giliran ide Anda.'));
    const actions = el('div', 'case-actions');
    const inquiry = 'Halo HDRG Creative Partner, saya tertarik dengan karya ' + project.title + '. Saya ingin berdiskusi tentang kebutuhan proyek saya.';
    const contact = link('https://wa.me/' + window.HDRG.whatsapp + '?text=' + encodeURIComponent(inquiry), 'Diskusikan proyek ↗', 'button button-blue'); contact.target = '_blank'; contact.rel = 'noopener noreferrer'; actions.append(contact);
    if (project.link) { const external = link(project.link.url, project.link.label + ' ↗', 'text-link'); external.target = '_blank'; external.rel = 'noopener noreferrer'; actions.append(external); }
    const share = el('button', 'text-link case-share', 'Salin tautan proyek ↗'); share.type = 'button';
    const shareStatus = el('p', 'share-status'); shareStatus.setAttribute('role', 'status');
    share.addEventListener('click', async () => {
      const url = new URL('./project.html', location.href); url.searchParams.set('id', project.id);
      try { await navigator.clipboard.writeText(url.href); shareStatus.textContent = 'Tautan proyek disalin.'; }
      catch { shareStatus.replaceChildren(link(url.href, url.href, 'text-link')); }
    }); actions.append(share); thanks.append(actions, shareStatus); outro.append(thanks);
    const next = projects[(projects.indexOf(project) + 1) % projects.length];
    if (next && next.id !== project.id) {
      const nextLink = link('./project.html?id=' + encodeURIComponent(next.id), '', 'case-next');
      nextLink.append(el('span', 'eyebrow', '/ NEXT PROJECT'), el('strong', '', next.title), el('span', 'next-arrow', '↗')); outro.append(nextLink);
    }
    root.replaceChildren(intro, gallery, outro);
    document.querySelector('#viewer-prev').hidden = images.length < 2; document.querySelector('#viewer-next').hidden = images.length < 2;
  });
})();
