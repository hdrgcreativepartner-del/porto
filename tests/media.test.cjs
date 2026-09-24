const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = { window: {}, URL }; vm.createContext(context);
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../media.js'),'utf8'),context);
const media=context.window.HDRGMedia;
const json=value=>JSON.parse(JSON.stringify(value));
test('normalizes supported YouTube URLs and time offsets',()=>{
  for(const url of ['https://youtu.be/M7lc1UVf-VE','https://www.youtube.com/watch?v=M7lc1UVf-VE','https://m.youtube.com/watch?v=M7lc1UVf-VE','https://youtube.com/live/M7lc1UVf-VE','https://www.youtube-nocookie.com/embed/M7lc1UVf-VE']) assert.equal(media.youtube(url).id,'M7lc1UVf-VE');
  assert.equal(media.youtube('https://youtube.com/shorts/M7lc1UVf-VE').aspect,'portrait');
  assert.equal(media.youtube('https://youtu.be/M7lc1UVf-VE?t=1m30s').start,90);
  assert.equal(media.youtube('https://www.youtube.com/embed/M7lc1UVf-VE?start=10').start,10);
});
test('rejects non-YouTube hosts, injected markup, credentials and non-video URLs',()=>{
  for(const url of ['https://youtube.com.evil.test/watch?v=M7lc1UVf-VE','https://youtube.com@evil.test/watch?v=M7lc1UVf-VE','javascript:alert(1)','data:text/html,evil','https://example.com/video.mp4','https://youtube.com/watch?v=x','https://youtube.com/playlist?list=abc','https://user:pass@youtube.com/watch?v=M7lc1UVf-VE','<iframe src="https://youtube.com/embed/M7lc1UVf-VE"></iframe>']) assert.equal(media.youtube(url),null,url);
});
test('retains ordered legacy images and discovers new uploads without duplicating the cover',()=>{
  const result=media.items({cover:'cover.webp',images:[{file:'02.png',caption:'Keep this'}]},['cover.webp','10.png','02.png','01.mp4','_ignored.png']);
  assert.deepEqual(json(result.map(x=>x.file)),['02.png','01.mp4','10.png']);
  assert.equal(result[0].caption,'Keep this'); assert.equal(result[1].type,'video');
});
test('preserves mixed media order and ignores malformed or missing references',()=>{
  const result=media.items({cover:'cover.png',media:[{type:'youtube',url:'https://youtube.com/shorts/M7lc1UVf-VE'},{type:'video',file:'clip.webm'},{type:'image',file:'still.png'},{type:'youtube',url:'https://evil.test/'},{type:'image',file:'missing.png'}]},['cover.png','still.png','clip.webm']);
  assert.deepEqual(json(result.map(x=>x.type)),['youtube','video','image']); assert.equal(result[0].aspect,'portrait');
});
test('cover-only projects and video-only folders still produce valid galleries',()=>{
  assert.equal(media.items({cover:'cover.png'},['cover.png'])[0].file,'cover.png');
  assert.equal(media.items({},['clip.mp4'])[0].type,'video');
  assert.equal(media.items({media:[{type:'youtube',url:'https://youtu.be/M7lc1UVf-VE'}]},[])[0].type,'youtube');
});
