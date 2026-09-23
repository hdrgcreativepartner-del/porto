'use strict';

(() => {
  const { projects, whatsapp } = window.HDRG;
  const grid = document.querySelector('#project-grid');
  const dialog = document.querySelector('#project-dialog');
  const dialogContent = document.querySelector('#dialog-content');
  const menu = document.querySelector('#main-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const form = document.querySelector('#brief-form');
  let lastProjectTrigger = null;

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
      const button = element('button', 'project-open');
      button.type = 'button';
      button.dataset.project = project.id;
      button.setAttribute('aria-label', 'Lihat detail ' + project.title);
      button.setAttribute('aria-haspopup', 'dialog');
      const media = element('div', 'project-media media-' + project.layout);
      media.append(projectImage(project.cover, project.alt, project.layout === 'posters' ? 'poster-one' : ''));
      if (project.secondary) media.append(projectImage(project.secondary, '', 'poster-two'));
      media.append(element('span', 'project-badge', project.type));
      if (project.layout === 'identity') media.append(element('span', 'identity-tag', 'FROM IDEAS TO VISUAL EXPERIENCES.'));
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
    document.querySelector('#project-count').textContent = visible.length + ' karya';
  }

  function openProject(id, trigger) {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    lastProjectTrigger = trigger;
    const header = element('div', 'dialog-header');
    const title = element('h2', '', project.title);
    title.id = 'dialog-title';
    header.append(element('p', 'dialog-kicker', project.type + ' / ' + project.year + ' / ' + project.label), title, element('p', 'dialog-summary', project.summary));
    const details = element('div', 'dialog-details');
    const scope = element('div');
    const list = element('ul');
    project.scope.forEach(item => list.append(element('li', '', item)));
    scope.append(element('h3', '', 'Lingkup kreatif'), list);
    details.append(element('p', '', project.description), scope);
    const gallery = element('div', 'dialog-gallery' + (project.images.length === 1 ? ' single' : ''));
    project.images.forEach(image => {
      const figure = element('figure');
      figure.append(projectImage(image.src, image.alt, image.className));
      gallery.append(figure);
    });
    const actions = element('div', 'dialog-actions');
    const inquiry = 'Halo HDRG Creative Partner, saya tertarik dengan karya ' + project.title + '. Saya ingin berdiskusi tentang kebutuhan proyek saya.';
    actions.append(externalLink('https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(inquiry), 'Diskusikan ide serupa', 'button button-blue'));
    if (project.link) actions.append(externalLink(project.link.url, project.link.label));
    dialogContent.replaceChildren(header, details, gallery, element('p', 'dialog-note', project.note), actions);
    if (menu.classList.contains('open')) setMenu(false);
    document.body.classList.add('modal-open');
    dialog.showModal();
    dialog.scrollTop = 0;
    dialog.querySelector('.dialog-close').focus({ preventScroll: true });
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

  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-project]');
    if (trigger) openProject(trigger.dataset.project, trigger);
  });
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (lastProjectTrigger?.isConnected) lastProjectTrigger.focus({ preventScroll: true });
  });

  menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.querySelector('.brand').addEventListener('click', () => setMenu(false));
  document.querySelector('.header-contact').addEventListener('click', () => setMenu(false));
  const desktop = window.matchMedia('(min-width: 621px)');
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
})();
