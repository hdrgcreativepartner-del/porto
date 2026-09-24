'use strict';

/* GitHub Pages generates media-index.json from the files uploaded to the repo.
   No GitHub token, public API request, or manual project list is needed. */
(() => {
  const { imagePattern: imageFile, items: mediaItems } = window.HDRGMedia;
  const categories = ['design', 'event', 'digital', 'lab'];
  const layouts = ['standard', 'posters', 'peering', 'elephant', 'digital', 'stage', 'identity'];
  const imageClasses = ['logo-on-dark', 'logo-on-blue', 'logo-on-white'];
  const labels = { design: 'Brand & Design', event: 'Event Visual', digital: 'Digital', lab: 'Creative Lab' };
  const natural = (a, b) => a.localeCompare(b, 'id', { numeric: true, sensitivity: 'base' });
  const text = (value, fallback = '') => typeof value === 'string' ? value : fallback;
  const titleFrom = value => value.replace(/^\d+[-_]/, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const assetURL = path => './' + path.split('/').map(encodeURIComponent).join('/');

  async function readJSON(path) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(path, { signal: controller.signal, cache: 'no-cache' });
      if (!response.ok) throw new Error('Asset response ' + response.status);
      return await response.json();
    } finally { clearTimeout(timeout); }
  }

  async function load() {
    const index = await readJSON('./media-index.json');
    if (index.version !== 1 || !Array.isArray(index.files)) throw new Error('Invalid media catalogue');
    const files = [...new Set(index.files.filter(path => typeof path === 'string').map(path => path.replace(/^\//, '')))];
    const groups = new Map();
    const clients = [];

    files.forEach(path => {
      const parts = path.split('/');
      if (parts.some(part => !part || /^[._]/.test(part))) return;
      if (parts[0] !== 'assets') return;
      if (parts[1] === 'clients' && parts.length === 3 && imageFile.test(parts[2])) {
        const stem = parts[2].replace(imageFile, '');
        clients.push({ src: assetURL(path), name: titleFrom(stem.replace(/--dark$/i, '')), dark: /--dark$/i.test(stem), filename: parts[2] });
      }
      if (parts[1] === 'portfolio' && parts.length === 4) {
        if (!groups.has(parts[2])) groups.set(parts[2], []);
        groups.get(parts[2]).push(parts[3]);
      }
    });

    const projects = await Promise.all([...groups].map(async ([id, filenames]) => {
      const images = filenames.filter(name => imageFile.test(name)).sort(natural);
      const prefix = 'assets/portfolio/' + id + '/';
      let metadata = {};
      if (filenames.includes('project.json')) {
        try { metadata = await readJSON(assetURL(prefix + 'project.json')); }
        catch (error) { console.warn('HDRG: periksa project.json untuk ' + id, error.message); }
      }
      if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) metadata = {};
      if (metadata.published === false) return null;
      const title = text(metadata.title, titleFrom(id));
      const selectedCategories = Array.isArray(metadata.categories) ? metadata.categories.filter(c => categories.includes(c)) : [];
      const projectCategories = selectedCategories.length ? [...new Set(selectedCategories)] : ['design'];
      const cover = images.includes(metadata.cover) ? metadata.cover : images.find(name => /^cover\./i.test(name)) || images[0];
      const media = mediaItems(metadata, filenames).map((item, number) => ({
        ...item,
        ...(item.file ? { src: assetURL(prefix + item.file) } : {}),
        alt: item.alt || title + ' — visual ' + (number + 1),
        title: item.title || title + ' — video ' + (number + 1),
        className: imageClasses.includes(item.className) ? item.className : ''
      }));
      if (!media.length) return null;
      const gallery = media.filter(item => item.type === 'image');
      let link;
      try {
        const url = new URL(metadata.link?.url);
        if (['https:', 'http:'].includes(url.protocol)) link = { url: url.href, label: text(metadata.link.label, 'Lihat proyek') };
      } catch { /* External link is optional. */ }
      return {
        id, title, categories: projectCategories,
        year: text(metadata.year, typeof metadata.year === 'number' ? String(metadata.year) : ''),
        client: text(metadata.client), subtitle: text(metadata.subtitle),
        label: text(metadata.label, projectCategories.map(c => labels[c]).join(' · ')),
        type: text(metadata.type, 'Proyek'),
        layout: layouts.includes(metadata.layout) ? metadata.layout : 'standard',
        cover: cover ? assetURL(prefix + cover) : '', alt: text(metadata.alt, title),
        secondary: images.includes(metadata.secondary) ? assetURL(prefix + metadata.secondary) : undefined,
        summary: text(metadata.summary), description: text(metadata.description), note: text(metadata.note),
        scope: Array.isArray(metadata.scope) ? metadata.scope.filter(item => typeof item === 'string') : [],
        images: gallery, media, hasVideo: media.some(item => item.type !== 'image'), link,
        order: Number.isFinite(metadata.order) ? metadata.order : 0
      };
    }));
    return {
      projects: projects.filter(Boolean).sort((a, b) => a.order - b.order || natural(a.title, b.title)),
      clients: clients.sort((a, b) => natural(a.filename, b.filename))
    };
  }

  window.HDRGCatalog = load().catch(error => {
    console.warn('HDRG: menggunakan katalog cadangan.', error.message);
    return { projects: window.HDRG.projects, clients: [], fallback: true };
  });
})();

