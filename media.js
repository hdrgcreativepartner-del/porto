'use strict';
/* Shared media validation for the public catalogue and content editor. */
window.HDRGMedia = (() => {
  const imagePattern = /\.(?:avif|jpe?g|png|webp|svg)$/i;
  const videoPattern = /\.(?:mp4|webm)$/i;
  const mediaPattern = /\.(?:avif|jpe?g|png|webp|svg|mp4|webm)$/i;
  const text = value => typeof value === 'string' ? value : '';
  const natural = (a, b) => a.localeCompare(b, 'id', { numeric: true, sensitivity: 'base' });
  function youtube(value) {
    try {
      const url = new URL(text(value).trim());
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.port) return null;
      const host = url.hostname.toLowerCase();
      const parts = url.pathname.split('/').filter(Boolean);
      let id;
      if (host === 'youtu.be' || host === 'www.youtu.be') id = parts.length === 1 ? parts[0] : null;
      else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
        if (url.pathname === '/watch') id = url.searchParams.get('v');
        else if (['shorts', 'embed', 'live'].includes(parts[0]) && parts.length === 2) id = parts[1];
      }
      if (!/^[a-zA-Z0-9_-]{11}$/.test(id || '')) return null;
      const raw = url.searchParams.get('start') || url.searchParams.get('t') || '';
      let start = 0;
      if (/^\d+$/.test(raw)) start = Number(raw);
      else { const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(raw); if (m) start = Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0); }
      start = Math.min(86400, Math.max(0, start));
      return { id, start, aspect: parts[0] === 'shorts' ? 'portrait' : 'landscape', url: 'https://www.youtube.com/watch?v=' + id + (start ? '&t=' + start + 's' : '') };
    } catch { return null; }
  }
  function items(metadata, filenames) {
    const files = filenames.filter(name => typeof name === 'string' && !name.includes('/') && !/^[._]/.test(name) && mediaPattern.test(name)).sort(natural);
    const source = Array.isArray(metadata.media) ? metadata.media : Array.isArray(metadata.images) ? metadata.images : [];
    const result = [], used = new Set();
    source.forEach(item => {
      if (!item || typeof item !== 'object') return;
      if (item.type === 'youtube') {
        const video = youtube(item.url); if (!video) return;
        result.push({ type: 'youtube', url: video.url, title: text(item.title), caption: text(item.caption), aspect: ['portrait','landscape'].includes(item.aspect) ? item.aspect : video.aspect });
      } else if (files.includes(item.file) && !used.has(item.file)) {
        used.add(item.file);
        result.push({ type: videoPattern.test(item.file) ? 'video' : 'image', file: item.file, alt: text(item.alt), title: text(item.title), caption: text(item.caption), className: text(item.className), aspect: item.aspect === 'portrait' ? 'portrait' : 'landscape' });
      }
    });
    files.filter(name => !used.has(name) && name !== metadata.cover && !/^cover\./i.test(name)).forEach(file => result.push({ type: videoPattern.test(file) ? 'video' : 'image', file, alt: '', title: '', caption: '', aspect: 'landscape' }));
    if (!result.length) { const cover = files.find(file => imagePattern.test(file) && (file === metadata.cover || /^cover\./i.test(file))) || files.find(file => imagePattern.test(file)); if (cover) result.push({ type: 'image', file: cover, alt: '', caption: '' }); }
    return result;
  }
  function frame(item) {
    const video = youtube(item.url); if (!video) return null;
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + video.id + '?playsinline=1&rel=0' + (video.start ? '&start=' + video.start : '');
    iframe.title = item.title || 'Video proyek di YouTube';
    iframe.loading = 'lazy'; iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true; iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    return iframe;
  }
  return { imagePattern, videoPattern, mediaPattern, youtube, items, frame };
})();
