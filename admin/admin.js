'use strict';
(() => {
  const api = window.HDRGGitHub;
  const $ = selector => document.querySelector(selector);
  const { imagePattern, videoPattern, mediaPattern, youtube, items: mediaItems } = window.HDRGMedia;
  const basePath = 'assets/portfolio/';
  const form = $('#project-form');
  let snapshot, projects = [], clients = [], clientBackup = [], editing, gallery = [], cover, dirty = false, busy = false, activeTab = 'projects';
  const previews = new Set();
  const el = (tag, css, text) => { const node = document.createElement(tag); if (css) node.className = css; if (text !== undefined) node.textContent = text; return node; };
  const slugify = value => value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0,80).replace(/-$/, '');
  const titleFrom = value => value.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const sort = (a,b) => a.localeCompare(b,'id',{numeric:true,sensitivity:'base'});
  const imageURL = path => 'https://raw.githubusercontent.com/hdrgcreativepartner-del/porto/' + snapshot.head + '/' + path.split('/').map(encodeURIComponent).join('/');
  const image = (src,alt) => { const node=el('img'); node.src=src; node.alt=alt; node.loading='lazy'; return node; };
  const button = (label,action,css='secondary') => {const node=el('button',css,label);node.type='button';node.addEventListener('click',action);return node;};
  const status = (selector,message,error=false) => {const node=$(selector);node.textContent=message;node.classList.toggle('error',error);};
  function preview(file) {const url=URL.createObjectURL(file);previews.add(url);return url;}
  function clearPreviews() {previews.forEach(url=>URL.revokeObjectURL(url));previews.clear();}
  function canLeave() {return !dirty || window.confirm('Ada perubahan yang belum disimpan. Tinggalkan perubahan ini?');}
  function displayPanel(name) {['projects','clients','editor'].forEach(panel=>$('#'+panel+'-panel').hidden=panel!==name);}
  function setTab(name) {activeTab=name;document.querySelectorAll('[data-tab]').forEach(b=>{b.classList.toggle('active',b.dataset.tab===name);b.setAttribute('aria-pressed',String(b.dataset.tab===name));});displayPanel(name);}
  async function during(action) {
    if(busy)return;
    busy=true;const controls=[...document.querySelectorAll('button,input,textarea,select')].map(node=>({node,disabled:node.disabled}));controls.forEach(({node})=>node.disabled=true);
    try {return await action();} finally {busy=false;controls.forEach(({node,disabled})=>{if(node.isConnected)node.disabled=disabled;});}
  }
  async function loadRemote() {
    const nextSnapshot = await api.snapshot();
    const folders = [...new Set(nextSnapshot.files.filter(file=>/^assets\/portfolio\/[a-z0-9]+(?:-[a-z0-9]+)*\/[^/]+$/i.test(file.path)).map(file=>file.path.split('/')[2]))];
    const nextProjects = await Promise.all(folders.map(async id=>{
      const files=nextSnapshot.files.filter(file=>file.path.startsWith(basePath+id+'/') && file.path.split('/').length===4);
      const metadataFile=files.find(file=>file.path.endsWith('/project.json'));
      let metadata={};
      if(metadataFile) {try {metadata=await api.readJSON(metadataFile.sha);}catch {throw new Error('Tidak dapat membaca '+id+'/project.json. Periksa format JSON melalui GitHub.');}}
      if(!metadata || typeof metadata!=='object' || Array.isArray(metadata))throw new Error('Format metadata proyek '+id+' tidak valid.');
      return {id,metadata,files};
    }));
    snapshot=nextSnapshot;projects=nextProjects.filter(project=>project.files.some(file=>mediaPattern.test(file.path)) || mediaItems(project.metadata, []).length).sort((a,b)=>(a.metadata.order||0)-(b.metadata.order||0)||sort(a.id,b.id));
    clients=snapshot.files.filter(file=>/^assets\/clients\/[^/]+$/i.test(file.path)&&imagePattern.test(file.path)&&!/^[_\.]/.test(file.path.split('/').pop())).map(file=>{
      const name=file.path.split('/').pop(),stem=name.replace(imagePattern,'');
      return {original:file.path,sha:file.sha,name:titleFrom(stem.replace(/--dark$/i,'')),dark:/--dark$/i.test(stem),ext:name.match(imagePattern)[0].toLowerCase(),src:imageURL(file.path)};
    });
    clientBackup=clients.map(item=>({...item}));clearPreviews();dirty=false;editing=null;gallery=[];cover=null;
    renderProjects();renderClients();
    $('#project-total').textContent=projects.length;$('#client-total').textContent=clients.length;
    setTab(activeTab);
  }
  function renderProjects() {
    const cards=projects.map(project=>{
      const metadata=project.metadata,card=el('article','admin-project');
      const images=project.files.filter(file=>imagePattern.test(file.path));
      const coverFile=images.find(file=>file.path.endsWith('/'+metadata.cover))||images.find(file=>/\/cover\./i.test(file.path))||images[0];
      const open=button('',()=>openProject(project),'project-edit');
      if(coverFile) open.append(image(imageURL(coverFile.path),metadata.title||titleFrom(project.id)));
      else open.append(el('div','project-no-cover','▶ Video')); 
      const info=el('div','project-card-info');info.append(el('span','project-state',metadata.published===false?'TERSEMBUNYI':'DITAMPILKAN'),el('h3','',metadata.title||titleFrom(project.id)),el('p','',metadata.label||'Portofolio'));
      open.append(info,el('span','edit-label','Edit proyek ↗'));card.append(open);return card;
    });
    $('#admin-projects').replaceChildren(...cards);
    if(!cards.length)$('#admin-projects').append(el('p','empty-state','Belum ada proyek. Mulai dengan Proyek baru.'));
  }
  function openProject(project=null) {
    if(!canLeave())return;
    clients=clientBackup.map(item=>({...item}));renderClients();editing=project;const data=project?.metadata||{};form.reset();delete form.elements.slug.dataset.manual;
    for(const key of ['title','client','year','subtitle','summary','description','note','type','label','order']) form.elements[key].value=data[key]??(key==='order'?0:key==='type'?'Proyek':'');
    form.elements.scope.value=Array.isArray(data.scope)?data.scope.join('\n'):'';
    form.elements.slug.value=project?.id||'';form.elements.slug.readOnly=!!project;
    form.elements.published.checked=data.published!==false;
    document.querySelectorAll('[name="category"]').forEach(input=>input.checked=(data.categories||['design']).includes(input.value));
    const files=(project?.files||[]).filter(item=>mediaPattern.test(item.path));
    gallery=mediaItems(data,files.map(file=>file.path.split('/').pop())).map(item=>{
      if(item.type==='youtube') return {...item,alt:item.title||'',name:'YouTube · '+youtube(item.url).id};
      const file=files.find(file=>file.path.endsWith('/'+item.file));
      const {file:filename,...info}=item;
      return {...info,name:filename,original:file.path,sha:file.sha,src:imageURL(file.path),alt:item.type==='video'?(item.title||''):(item.alt||'')};
    });
    const coverFile=files.find(item=>imagePattern.test(item.path)&&item.path.endsWith('/'+data.cover))||files.find(item=>/\/cover\./i.test(item.path)&&imagePattern.test(item.path));
    cover=coverFile?{name:coverFile.path.split('/').pop(),original:coverFile.path,sha:coverFile.sha,src:imageURL(coverFile.path)}:null;
    $('#editor-title').textContent=project?'Edit proyek':'Proyek baru';
    $('#project-live-link').hidden=!project;$('#project-live-link').href='../project.html?id='+encodeURIComponent(project?.id||'');
    status('#project-status','');status('#media-status','');displayPanel('editor');renderGallery();renderCover();dirty=false;
    $('#editor-title').scrollIntoView({block:'start'});
  }
  function renderCover() {const box=$('#cover-preview');box.replaceChildren();const current=cover||gallery.find(item=>item.type==='image');box.append(current?image(current.src,'Pratinjau cover'):el('span','','Pilih cover proyek'));}
  function renderGallery() {
    const cards=gallery.map((item,index)=>{
      const card=el('article','gallery-item');
      const visual=el('div','media-preview'+(item.aspect==='portrait'?' portrait':''));
      if(item.type==='youtube'){const frame=window.HDRGMedia.frame({...item,title:item.alt});if(frame)visual.append(frame);}
      else if(item.type==='video'){const video=el('video');video.src=item.src;video.controls=true;video.playsInline=true;video.preload='none';video.setAttribute('aria-label',item.alt||item.name);visual.append(video);}
      else visual.append(image(item.src,item.alt||item.name));
      card.append(visual);
      const content=el('div','gallery-fields');content.append(el('p','file-name',String(index+1).padStart(2,'0')+' / '+item.name));
      const altLabel=el('label','',item.type==='image'?'Deskripsi gambar (alt)':'Judul video');const alt=el('input');alt.type='text';alt.value=item.alt;alt.maxLength=300;alt.addEventListener('input',()=>{item.alt=alt.value;dirty=true;});altLabel.append(alt);
      const captionLabel=el('label','','Caption (opsional)');const caption=el('input');caption.type='text';caption.value=item.caption;caption.maxLength=600;caption.addEventListener('input',()=>{item.caption=caption.value;dirty=true;});captionLabel.append(caption);content.append(altLabel,captionLabel);
      if(item.type!=='image'){
        const ratioLabel=el('label','','Format video'),ratio=el('select');
        [['landscape','Landscape · 16:9'],['portrait','Portrait · 9:16']].forEach(([value,text])=>{const option=el('option','',text);option.value=value;ratio.append(option);});
        ratio.value=item.aspect||'landscape';ratio.addEventListener('change',()=>{item.aspect=ratio.value;dirty=true;renderGallery();});ratioLabel.append(ratio);content.append(ratioLabel);
      }
      const actions=el('div','gallery-controls');const up=button('↑',()=>moveImage(index,-1));up.setAttribute('aria-label','Naikkan media '+(index+1));up.disabled=index===0;
      const down=button('↓',()=>moveImage(index,1));down.setAttribute('aria-label','Turunkan media '+(index+1));down.disabled=index===gallery.length-1;
      actions.append(up,down,button('Hapus',()=>{gallery.splice(index,1);dirty=true;renderGallery();renderCover();},'quiet danger'));content.append(actions);card.append(content);return card;
    });$('#editor-gallery').replaceChildren(...cards);$('#gallery-total').textContent=gallery.length+' media';
    if(!cards.length)$('#editor-gallery').append(el('p','empty-state','Susun cerita visual Anda di sini.'));
  }
  function moveImage(index,offset){const target=index+offset;if(target<0||target>=gallery.length)return;[gallery[index],gallery[target]]=[gallery[target],gallery[index]];dirty=true;renderGallery();renderCover();}
  function validateFiles(files,allowVideo=false) {
    if(files.some(file=>!(allowVideo?mediaPattern:imagePattern).test(file.name)))throw new Error(allowVideo?'Gunakan gambar, MP4, atau WebM.':'Gunakan JPG, PNG, WebP, AVIF, atau SVG.');
    if(files.some(file=>!file.size))throw new Error('Ada file kosong. Pilih file yang dapat dibuka.');
    if(files.some(file=>imagePattern.test(file.name)&&file.size>4*1024*1024))throw new Error('Maksimum 4 MB per gambar. Kompres gambar lalu pilih ulang.');
    if(files.some(file=>videoPattern.test(file.name)&&file.size>25*1024*1024))throw new Error('Maksimum 25 MB per video. Kompres video atau gunakan tautan YouTube.');
    if(files.length>40||files.reduce((sum,file)=>sum+file.size,0)>(allowVideo?50:20)*1024*1024)throw new Error('Pilih maksimal 40 file, dengan total '+(allowVideo?50:20)+' MB.');
  }
  function fileName(file) {const ext=file.name.match(mediaPattern)[0].toLowerCase();return (slugify(file.name.replace(mediaPattern,''))||'visual')+ext;}
  function bindUpload(selector,accept,allowVideo=false) {
    const input=$(selector),zone=input.closest('label');
    const process=files=>{if(busy||!files.length)return;try{validateFiles(files,allowVideo);accept(files);dirty=true;input.value='';}catch(error){status(activeTab==='clients'?'#clients-status':'#project-status',error.message,true);}};
    input.addEventListener('change',()=>process([...input.files]));
    zone.addEventListener('dragover',event=>{event.preventDefault();zone.classList.add('drag-over');});zone.addEventListener('dragleave',()=>zone.classList.remove('drag-over'));
    zone.addEventListener('drop',event=>{event.preventDefault();zone.classList.remove('drag-over');process([...event.dataTransfer.files]);});
  }
  bindUpload('#gallery-upload',files=>{
    for(const file of files) {let index=gallery.length+1,name;do{name=String(index++).padStart(2,'0')+'-'+fileName(file);}while(gallery.some(item=>item.name===name));gallery.push({name,file,type:videoPattern.test(file.name)?'video':'image',src:preview(file),alt:'',caption:'',aspect:'landscape'});}
    renderGallery();renderCover();status('#project-status','Media ditambahkan. Klik Simpan ke GitHub untuk menerbitkan.');
  },true);
  $('#add-youtube').addEventListener('click',()=>{
    if(busy)return;
    const input=$('#youtube-url'),video=youtube(input.value);
    if(!video){status('#media-status','Tautan YouTube belum valid. Gunakan tautan video, youtu.be, Shorts, atau live.',true);input.focus();return;}
    if(gallery.some(item=>item.type==='youtube'&&item.url===video.url)){status('#media-status','Video YouTube ini sudah ada di galeri.',true);return;}
    gallery.push({type:'youtube',url:video.url,aspect:video.aspect,alt:'',caption:'',name:'YouTube · '+video.id});
    input.value='';dirty=true;renderGallery();status('#media-status','Video YouTube ditambahkan. Lengkapi judul lalu simpan.');
  });
  $('#youtube-url').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();$('#add-youtube').click();}});
  bindUpload('#cover-upload',files=>{const file=files[0];cover={name:'cover'+file.name.match(imagePattern)[0].toLowerCase(),file,src:preview(file)};renderCover();status('#project-status','Cover siap disimpan.');});
  bindUpload('#clients-upload',files=>{files.forEach(file=>{const stem=file.name.replace(imagePattern,'');clients.push({name:titleFrom(stem.replace(/--dark$/i,'')),dark:/--dark$/i.test(stem),ext:file.name.match(imagePattern)[0].toLowerCase(),file,src:preview(file)});});renderClients();status('#clients-status','Logo ditambahkan. Klik Simpan logo ke GitHub untuk menerbitkan.');});
  const encodeFile=file=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(new Error('Gagal membaca media. Pilih ulang file.'));reader.readAsDataURL(file);});
  function success(result,message) {const node=$('#studio-status');node.classList.remove('error');node.replaceChildren(document.createTextNode(message+' Website diperbarui setelah proses publikasi GitHub selesai. '));const link=el('a','','Lihat pembaruan ↗');link.href=result.url;link.target='_blank';link.rel='noopener noreferrer';node.append(link);}
  async function afterSave(result,message) {
    dirty=false;success(result,message);
    try {await loadRemote();}catch{status('#studio-status','Pembaruan sudah tersimpan, tetapi daftar terbaru gagal dimuat. Gunakan Muat ulang data; jangan simpan ulang perubahan lama.',true);snapshot=null;displayPanel('projects');}
  }
  form.addEventListener('submit',event=>{
    event.preventDefault();if(busy||!form.reportValidity())return;
    const data=new FormData(form),id=String(data.get('slug')).trim();
    const selected=data.getAll('category');
    if(!selected.length){status('#project-status','Pilih setidaknya satu kategori.',true);return;}
    if(!gallery.length&&!cover){status('#project-status','Tambahkan gambar atau video proyek.',true);return;}
    const selectedCover=cover||gallery.find(item=>item.type==='image');
    if(!selectedCover){status('#project-status','Unggah gambar cover untuk kartu proyek video Anda.',true);return;}
    if($('#youtube-url').value.trim()){status('#project-status','Klik Tambahkan untuk memasukkan tautan YouTube ke galeri, atau kosongkan kolom tautannya.',true);return;}
    if(!editing&&projects.some(project=>project.id===id)){status('#project-status','Nama folder sudah dipakai. Gunakan nama lain.',true);return;}
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)){status('#project-status','Nama folder hanya boleh berisi huruf kecil, angka, dan tanda hubung.',true);return;}
    const title=String(data.get('title')).trim();if(!title){status('#project-status','Judul proyek tidak boleh kosong.',true);return;}
    const uploads=[...gallery,cover].filter(item=>item?.file);
    if(uploads.reduce((sum,item)=>sum+item.file.size,0)>50*1024*1024){status('#project-status','Total media baru maksimum 50 MB per penyimpanan.',true);return;}
    during(async()=>{
      try {
        if(!snapshot)throw new Error('Muat ulang data sebelum menyimpan kembali.');
        const prefix=basePath+id+'/',metadata={...(editing?.metadata||{})};
        for(const key of ['title','client','year','subtitle','summary','description','note','type','label'])metadata[key]=String(data.get(key)||'').trim();
        metadata.categories=selected;metadata.scope=String(data.get('scope')||'').split('\n').map(line=>line.trim()).filter(Boolean);metadata.order=Number(data.get('order')||0);metadata.published=data.get('published')==='on';
        metadata.cover=selectedCover.name;
        metadata.media=gallery.map((item,index)=>{
          const entry={type:item.type,...(item.type==='youtube'?{url:item.url}:{file:item.name})};
          if(item.type==='image'){entry.alt=item.alt.trim()||title+' — visual '+(index+1);if(item.className)entry.className=item.className;}
          else {entry.title=item.alt.trim()||title+' — video '+(index+1);entry.aspect=item.aspect||'landscape';}
          if(item.caption.trim())entry.caption=item.caption.trim();
          return entry;
        });
        metadata.images=metadata.media.filter(item=>item.type==='image').map(({type,...item})=>item);
        const keep=new Set([...gallery.filter(item=>item.type!=='youtube').map(item=>prefix+item.name),prefix+metadata.cover]);
        if(metadata.secondary&&!keep.has(prefix+metadata.secondary))delete metadata.secondary;
        const changes=[];for(const item of uploads){status('#project-status','Membaca '+item.name+'…');changes.push({path:prefix+item.name,encoding:'base64',content:await encodeFile(item.file)});}
        for(const file of editing?.files||[])if(mediaPattern.test(file.path)&&!keep.has(file.path))changes.push({path:file.path,sha:null});
        changes.push({path:prefix+'project.json',content:JSON.stringify(metadata,null,2)+'\n'});
        const result=await api.save(snapshot,changes,'Update portfolio: '+title,message=>status('#project-status',message));
        await afterSave(result,'Proyek berhasil disimpan.');
      }catch(error){status('#project-status',error.message,true);}
    });
  });
  function renderClients() {
    const cards=clients.map((item,index)=>{
      const card=el('article','client-card');const plate=el('div','client-plate'+(item.dark?' dark':''));plate.append(image(item.src,item.name));card.append(plate);
      const label=el('label','','Nama klien');const name=el('input');name.value=item.name;name.required=true;name.maxLength=80;name.addEventListener('input',()=>{item.name=name.value;dirty=true;});label.append(name);card.append(label);
      const darkLabel=el('label','check','');const check=el('input');check.type='checkbox';check.checked=item.dark;check.addEventListener('change',()=>{item.dark=check.checked;dirty=true;plate.classList.toggle('dark',item.dark);});darkLabel.append(check,document.createTextNode('Latar gelap'));card.append(darkLabel,button('Hapus logo',()=>{clients.splice(index,1);dirty=true;renderClients();},'quiet danger'));return card;
    });$('#editor-clients').replaceChildren(...cards);$('#client-total').textContent=clients.length;
    if(!cards.length)$('#editor-clients').append(el('p','empty-state','Logo klien yang Anda unggah akan muncul otomatis di website.'));
  }
  $('#clients-form').addEventListener('submit',event=>{
    event.preventDefault();if(busy||!$('#clients-form').reportValidity())return;
    during(async()=>{
      try {
        if(!snapshot)throw new Error('Muat ulang data sebelum menyimpan kembali.');
        if(clients.reduce((sum,item)=>sum+(item.file?.size||0),0)>20*1024*1024)throw new Error('Total logo baru maksimum 20 MB per penyimpanan.');
        const changes=new Map(),destinations=new Set();
        for(const item of clients){const slug=slugify(item.name);if(!slug)throw new Error('Isi nama klien dengan huruf atau angka.');const path='assets/clients/'+slug+(item.dark?'--dark':'')+item.ext;if(destinations.has(path))throw new Error('Ada nama logo yang sama. Bedakan nama klien sebelum menyimpan.');destinations.add(path);
          if(item.file)changes.set(path,{path,encoding:'base64',content:await encodeFile(item.file)});
          else if(path!==item.original)changes.set(path,{path,sha:item.sha});
        }
        snapshot.files.filter(item=>/^assets\/clients\/[^/]+$/i.test(item.path)&&imagePattern.test(item.path)).forEach(item=>{if(!destinations.has(item.path))changes.set(item.path,{path:item.path,sha:null});});
        const result=await api.save(snapshot,[...changes.values()],'Update client logos',message=>status('#clients-status',message));await afterSave(result,'Logo klien berhasil disimpan.');
      }catch(error){status('#clients-status',error.message,true);}
    });
  });
  $('#login-form').addEventListener('submit',event=>{
    event.preventDefault();const value=$('#github-token').value.trim();$('#github-token').value='';if(!value)return;
    during(async()=>{try{status('#login-status','Menghubungkan akun dan memuat karya…');const user=await api.login(value);await loadRemote();$('#account-label').textContent='Terhubung sebagai '+user.login+' · porto / main';$('#login-screen').hidden=true;$('#studio').hidden=false;status('#login-status','');}catch(error){api.logout();status('#login-status',error.message,true);}});
  });
  $('#refresh-button').addEventListener('click',()=>{if(!canLeave())return;during(async()=>{try{status('#studio-status','Memuat versi terbaru…');await loadRemote();status('#studio-status','Data terbaru berhasil dimuat.');}catch(error){status('#studio-status',error.message,true);}});});
  $('#logout-button').addEventListener('click',()=>{if(busy||!canLeave())return;api.logout();clearPreviews();snapshot=null;projects=[];clients=[];dirty=false;$('#studio').hidden=true;$('#login-screen').hidden=false;$('#login-form').reset();$('#admin-projects').replaceChildren();$('#editor-gallery').replaceChildren();status('#login-status','Anda sudah keluar.');});
  $('#new-project').addEventListener('click',()=>openProject());
  $('#back-projects').addEventListener('click',()=>{if(!canLeave())return;dirty=false;displayPanel('projects');});
  document.querySelectorAll('[data-tab]').forEach(tab=>tab.addEventListener('click',()=>{if(!canLeave())return;clients=clientBackup.map(item=>({...item}));renderClients();dirty=false;setTab(tab.dataset.tab);}));
  form.addEventListener('input',()=>dirty=true);
  form.elements.title.addEventListener('input',()=>{if(!editing&&!form.elements.slug.dataset.manual)form.elements.slug.value=slugify(form.elements.title.value);});
  form.elements.slug.addEventListener('input',()=>form.elements.slug.dataset.manual='true');
  window.addEventListener('beforeunload',event=>{if(dirty||busy){event.preventDefault();event.returnValue='';}});
  window.addEventListener('pagehide',()=>api.logout());
  window.addEventListener('pageshow',event=>{if(event.persisted){$('#studio').hidden=true;$('#login-screen').hidden=false;status('#login-status','Sesi berakhir. Hubungkan kembali untuk mengedit.');}});
})();

