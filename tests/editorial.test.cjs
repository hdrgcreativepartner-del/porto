const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
class Element {
  constructor(id='') { this.id=id; this.children=[]; this.events={}; this.attributes={}; this.style={setProperty(){}}; }
  setAttribute(k,v){this.attributes[k]=v;}
  append(...es){for(const e of es){if(e.parent)e.parent.children.splice(e.parent.children.indexOf(e),1);e.parent=this;this.children.push(e);}}
  replaceChildren(...es){this.children=[];this.append(...es);}
  before(e){e.parent=this.parent;this.parent.children.splice(this.parent.children.indexOf(this),0,e);}
  replaceWith(e){if(e.parent)e.parent.children.splice(e.parent.children.indexOf(e),1);const i=this.parent.children.indexOf(this);this.parent.children[i]=e;e.parent=this.parent;}
  addEventListener(k,f){this.events[k]=f;}
  closest(){return this;}
  querySelectorAll(){return this.children.filter(e=>e.id);}
}
const flush = () => new Promise(resolve=>setImmediate(resolve));
test('configured section order preserves editorial sections and ignores duplicates',async()=>{
 const main=new Element();const ids=['home','','work','services','','about','contact'];main.append(...ids.map(x=>new Element(x)));
 const original=[...main.children];
 const config={sections:[{id:'home'},{id:'work'},{id:'services'},{id:'about'},{id:'contact',visible:false},{id:'home'}]};
 const document={documentElement:new Element(),querySelector:s=>s==='main'?main:null,querySelectorAll:()=>[],createComment:()=>new Element()};
 vm.runInNewContext(fs.readFileSync('site-runtime.js','utf8'),{document,fetch:async()=>({ok:true,json:async()=>config}),console});await flush();
 assert.deepEqual(main.children,original);assert.equal(main.children[6].hidden,true);
 config.sections=[{id:'contact'},{id:'home'},{id:'work'},{id:'services'},{id:'about'}];
 vm.runInNewContext(fs.readFileSync('site-runtime.js','utf8'),{document,fetch:async()=>({ok:true,json:async()=>config}),console});await flush();
 assert.deepEqual(main.children.map(e=>e.id),['contact','','home','work','','services','about']);
});
test('carousel tolerates loading input and distinguishes scrolling from horizontal swipe',async()=>{
 const nodes=Object.fromEntries(['stage','slider','prev','next','index'].map(k=>[k,new Element(k)]));let resolve;
 const catalogue=new Promise(r=>resolve=r);
 vm.runInNewContext(fs.readFileSync('featured-work.js','utf8'),{document:{getElementById:id=>nodes[id.replace('featured-','')],createElement:()=>new Element()},window:{HDRGCatalog:catalogue}});
 nodes.next.events.click();nodes.slider.events.keydown({target:nodes.slider,key:'ArrowRight',preventDefault(){}});assert.equal(nodes.stage.children.length,0);
 resolve({projects:[{id:'a',title:'A',cover:'a.jpg'},{id:'b',title:'B',cover:'b.jpg'}]});await flush();
 assert.equal(nodes.index.textContent,'01 / 02');nodes.next.events.click();assert.equal(nodes.index.textContent,'02 / 02');
 const swipe=(x,y)=>{nodes.slider.events.touchstart({touches:[{screenX:200,screenY:200}]});nodes.slider.events.touchend({changedTouches:[{screenX:x,screenY:y}]});};
 swipe(100,0);assert.equal(nodes.index.textContent,'02 / 02');swipe(100,210);assert.equal(nodes.index.textContent,'01 / 02');
 nodes.slider.events.keydown({target:nodes.slider,key:'ArrowLeft',preventDefault(){}});assert.equal(nodes.index.textContent,'02 / 02');
});
