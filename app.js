'use strict';

(() => {
  let projects = window.HDRG.projects;
  const { whatsapp } = window.HDRG;
  const grid = document.querySelector('#project-grid');
  const menu = document.querySelector('#main-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const form = document.querySelector('#brief-form');

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function icon(name = 'arrow') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#i-' + name);
    svg.append(use);
    return svg;
  }

  function projectImage(src, alt, className = '') {
    const img = element('img', className);
    img.src = src;
    img.alt = alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    return img;
  }

  function externalLink(url, text, className = 'text-link') {
    const link = element('a', className, text);
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.append(icon());
    return link;
  }

  function renderProjects(filter = 'all') {
    const visible = projects.filter(p => filter === 'all' || p.categories.includes(filter));
    const cards = visible.map(project => {
      const card = element('article', 'project-card');
      const button = element('a', 'project-open');
      button.href = './project.html?id=' + encodeURIComponent(project.id);
      button.dataset.project = project.id;
      button.setAttribute('aria-label', 'Lihat detail ' + project.title);
      const media = element('div', 'project-media media-' + project.layout);
      if (project.cover) media.append(projectImage(project.cover, project.alt));
      else { media.classList.add('media-placeholder'); media.append(element('span', '', project.title)); }
      if (project.hasVideo) media.append(element('span', 'project-badge', '▶ Video'));
      const arrow = element('span', 'project-arrow');
      arrow.append(icon());
      media.append(arrow);
      const info = element('div', 'project-info');
      const title = element('div');
      title.append(element('h3', '', project.title), element('p', '', project.label));
      info.append(title, element('span', 'project-year', project.year));
      button.append(media, info);
      card.append(button);
      return card;
    });
    grid.replaceChildren(...cards);
    if (!cards.length) grid.append(element('p', 'gallery-empty', 'Belum ada karya dalam kategori ini.'));
    document.querySelector('.filter[data-filter="all"] span').textContent = String(projects.length).padStart(2, '0');
    document.querySelector('#project-count').textContent = visible.length + ' karya';
  }

  function setMenu(open, returnFocus = false) {
    menu.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    document.body.classList.toggle('menu-open', open);
    document.querySelector('main').inert = open;
    document.querySelector('footer').inert = open;
    if (returnFocus) menuToggle.focus();
  }

  document.querySelector('.filters').addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    document.querySelectorAll('[data-filter]').forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    renderProjects(button.dataset.filter);
  });

  menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.querySelector('.brand').addEventListener('click', () => setMenu(false));
  document.querySelector('.header-contact').addEventListener('click', () => setMenu(false));
  const desktop = window.matchMedia('(min-width: 761px)');
  desktop.addEventListener('change', event => { if (event.matches) setMenu(false); });
  document.addEventListener('keydown', event => {
    if (!menu.classList.contains('open')) return;
    if (event.key === 'Escape') setMenu(false, true);
    if (event.key === 'Tab') {
      const focusable = [...document.querySelectorAll('.site-header a, .site-header button')].filter(item => item.getClientRects().length);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const fields = new FormData(form);
    const name = String(fields.get('name') || '').trim();
    const brand = String(fields.get('brand') || '').trim();
    const service = String(fields.get('service') || '').trim();
    const message = String(fields.get('message') || '').trim();
    form.elements.name.setCustomValidity(name ? '' : 'Silakan isi nama Anda.');
    form.elements.message.setCustomValidity(message ? '' : 'Ceritakan sedikit ide Anda.');
    if (!form.reportValidity()) return;
    const brief = [
      'Halo HDRG Creative Partner!', '', 'Nama: ' + name,
      ...(brand ? ['Brand / organisasi: ' + brand] : []),
      'Kebutuhan: ' + service, '', 'Tentang proyek:', message
    ].join('\n');
    const url = 'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(brief);
    // Membuka draft saja. Pesan tidak dikirim oleh website.
    window.open(url, '_blank', 'noopener,noreferrer');
    const status = document.querySelector('#form-status');
    status.replaceChildren(document.createTextNode('Draft brief siap. Jika tab baru belum terbuka, '), externalLink(url, 'buka WhatsApp di sini'));
  });
  form.addEventListener('input', event => { if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity(''); });

  if ('IntersectionObserver' in window) {
    const activeNav = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        menu.querySelectorAll('a').forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-12% 0px -63% 0px', threshold: 0 });
    document.querySelectorAll('main section[id]').forEach(section => activeNav.observe(section));
  }

  document.querySelector('#year').textContent = new Date().getFullYear();
  document.querySelector('.filter[data-filter="all"] span').textContent = String(projects.length).padStart(2, '0');
  document.querySelectorAll('[data-whatsapp]').forEach(link => { link.href = 'https://wa.me/' + whatsapp; });
  renderProjects();
  window.HDRGCatalog.then(catalog => {
    projects = catalog.projects;
    renderProjects(document.querySelector('.filter.active')?.dataset.filter || 'all');
    if (catalog.clients.length) {
      const logos = document.querySelector('#client-logos');
      catalog.clients.forEach(client => {
        const card = element('div', 'client-logo' + (client.dark ? ' client-logo-dark' : ''));
        const img = projectImage(client.src, client.name);
        card.append(img);
        logos.append(card);
      });
      logos.hidden = false;
      document.querySelector('.experience-names').hidden = true;
    }
  });
})();

