'use strict';
/* Credentials remain inside this closure. Only the GitHub API receives them. */
window.HDRGGitHub = (() => {
  const repo = '/repos/hdrgcreativepartner-del/porto';
  const branch = 'main';
  let token = '';
  async function request(path, options = {}) {
    if (!token) throw new Error('Masuk ke GitHub terlebih dahulu.');
    if (path !== '/user' && !path.startsWith(repo + '/') && path !== repo) throw new Error('Alamat API tidak diizinkan.');
    let response;
    try {
      response = await fetch('https://api.github.com' + path, {
        method: options.method || 'GET', cache: 'no-store', credentials: 'omit', redirect: 'error',
        headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(options.body ? { 'Content-Type': 'application/json' } : {}) },
        ...(options.body ? { body: JSON.stringify(options.body) } : {})
      });
    } catch { throw new Error('Koneksi ke GitHub terputus. Periksa internet lalu coba kembali; perubahan formulir masih ada.'); }
    if (!response.ok) {
      if (response.status === 401) throw new Error('Token tidak valid atau kedaluwarsa. Keluar lalu hubungkan ulang.');
      if (response.status === 403) throw new Error('GitHub menolak akses. Periksa izin Contents: Read and write, persetujuan organisasi, atau batas permintaan API.');
      if (response.status === 404) throw new Error('Repo atau file tidak ditemukan. Pastikan token memilih repo porto.');
      if (response.status === 409 || response.status === 422) throw new Error('GitHub menolak pembaruan: data berubah atau branch dilindungi. Muat ulang data dan periksa pengaturan branch.');
      throw new Error('Permintaan GitHub gagal (' + response.status + '). Coba kembali.');
    }
    return response.status === 204 ? null : response.json();
  }
  async function login(value) {
    token = value.trim();
    try {
      const user = await request('/user');
      const repository = await request(repo);
      if (!repository.permissions?.push) throw new Error('Akun ini belum memiliki akses tulis ke repo porto.');
      return { login: user.login };
    } catch (error) { token = ''; throw error; }
  }
  async function snapshot() {
    const ref = await request(repo + '/git/ref/heads/' + branch);
    const commit = await request(repo + '/git/commits/' + ref.object.sha);
    const tree = await request(repo + '/git/trees/' + commit.tree.sha + '?recursive=1');
    if (tree.truncated) throw new Error('Daftar file terlalu besar. Kelola melalui GitHub untuk saat ini.');
    return { head: ref.object.sha, tree: commit.tree.sha, files: tree.tree.filter(item => item.type === 'blob') };
  }
  async function readJSON(sha) {
    const blob = await request(repo + '/git/blobs/' + sha);
    const bytes = Uint8Array.from(atob(blob.content.replace(/\s/g, '')), c => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  const managed = path => /^assets\/(?:clients\/[^/]+\.(?:png|jpe?g|webp|avif|svg)|portfolio\/[a-z0-9]+(?:-[a-z0-9]+)*\/(?:project\.json|[^/]+\.(?:png|jpe?g|webp|avif|svg)))$/i.test(path) && !path.split('/').some(part => /^[._]/.test(part));
  async function save(base, changes, message, progress = () => {}) {
    if (!changes.length) throw new Error('Belum ada perubahan untuk disimpan.');
    if (changes.some(item => !managed(item.path))) throw new Error('Lokasi file di luar folder konten.');
    if (new Set(changes.map(item => item.path)).size !== changes.length) throw new Error('Ada nama file ganda. Ubah nama sebelum menyimpan.');
    const current = await request(repo + '/git/ref/heads/' + branch);
    if (current.object.sha !== base.head) throw new Error('Repo telah berubah sejak dibuka. Salin teks yang belum disimpan, lalu gunakan Muat ulang data sebelum menyimpan kembali.');
    const tree = [];
    for (let i = 0; i < changes.length; i++) {
      const change = changes[i];
      progress('Menyiapkan file ' + (i + 1) + ' dari ' + changes.length + '…');
      if ('sha' in change) tree.push({ path: change.path, mode: '100644', type: 'blob', sha: change.sha });
      else {
        const blob = await request(repo + '/git/blobs', { method: 'POST', body: { content: change.content, encoding: change.encoding || 'utf-8' } });
        tree.push({ path: change.path, mode: '100644', type: 'blob', sha: blob.sha });
      }
    }
    progress('Menyimpan pembaruan ke GitHub…');
    const nextTree = await request(repo + '/git/trees', { method: 'POST', body: { base_tree: base.tree, tree } });
    const commit = await request(repo + '/git/commits', { method: 'POST', body: { message, tree: nextTree.sha, parents: [base.head] } });
    await request(repo + '/git/refs/heads/' + branch, { method: 'PATCH', body: { sha: commit.sha, force: false } });
    return { sha: commit.sha, url: 'https://github.com/hdrgcreativepartner-del/porto/commit/' + commit.sha };
  }
  return { login, logout: () => { token = ''; }, snapshot, readJSON, save };
})();
