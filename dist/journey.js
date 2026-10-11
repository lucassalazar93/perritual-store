'use strict';
/* Journey layer: loader, scroll-linked scenes and pointer depth.
   No dependencies and no intercepted scrolling. One frame loop that only
   runs while the page is moving. Content stays visible if this file fails. */
(()=>{
 const root=document.documentElement;
 const q=(s,c=document)=>c.querySelector(s),qa=(s,c=document)=>[...c.querySelectorAll(s)];
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const on=()=>root.dataset.motion!=='paused';
 const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
 const smooth=t=>t*t*(3-2*t);
 const OUT='cubic-bezier(.16,1,.3,1)',INOUT='cubic-bezier(.77,0,.175,1)';
 const icon=id=>`<svg viewBox="0 0 64 64"><use href="#${id}"/></svg>`;
 root.classList.add('mj');

 // Loader: real progress (images + fonts) with a floor, so the bloom is always seen.
 const loader=q('#loader');
 function reveal(){root.classList.remove('pre');root.classList.add('go');if(loader)loader.remove()}
 function burst(r){
  const cx=r.left+r.width/2,cy=r.top+r.height/2,tones=['#b6492d','#edc68b','#acb89a','#c2add8'];
  for(let i=0;i<16;i++){
   const el=document.createElement('i');el.className='spark';el.innerHTML=icon(i%4?'heart':'paw');
   el.style.cssText=`left:${cx}px;top:${cy}px;fill:${tones[i%4]}`;loader.append(el);
   const a=i/16*Math.PI*2+Math.random()*.4,d=r.width*(.55+Math.random()*.45);
   el.animate([{transform:'translate(0,0) scale(.4)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(1.15) rotate(${Math.random()*120-60}deg)`,opacity:0}],{duration:900+Math.random()*400,easing:OUT,fill:'forwards'});
  }
 }
 function runLoader(){
  if(!loader||!on()||!root.classList.contains('pre'))return reveal();
  const logo=q('.loader-logo',loader),count=q('.loader-count',loader),paws=qa('.loader-paws svg',loader);
  const pending=qa('img').filter(i=>i.loading!=='lazy'),total=pending.length+1,MIN=1900,MAX=5000,start=performance.now();
  let loaded=0,shown=0;
  const tick=()=>{loaded++};
  pending.forEach(i=>{if(i.complete)tick();else{i.addEventListener('load',tick,{once:true});i.addEventListener('error',tick,{once:true})}});
  (document.fonts?document.fonts.ready:Promise.resolve()).then(tick,tick);
  function finish(){
   count.textContent='100';paws.forEach(p=>p.classList.add('on'));
   root.classList.remove('pre');loader.style.cssText='position:fixed;inset:0;z-index:200;display:grid;place-content:center;justify-items:center;gap:26px';
   logo.style.animation='none';logo.style.transformOrigin='50% 50%';
   const from=logo.getBoundingClientRect(),to=q('.brand img').getBoundingClientRect();
   const dx=to.left+to.width/2-from.left-from.width/2,dy=to.top+to.height/2-from.top-from.height/2;
   burst(from);loader.classList.add('out');logo.classList.add('seal');
   setTimeout(()=>root.classList.add('go'),420);
   logo.animate([{transform:'none',opacity:1},{opacity:1,offset:.72},{transform:`translate(${dx}px,${dy}px) scale(${to.width/from.width})`,opacity:0}],{duration:900,delay:260,easing:INOUT,fill:'forwards'}).finished.then(reveal,reveal);
  }
  (function step(now){
   if(!root.classList.contains('pre'))return reveal();
   const t=now-start,target=t>MAX?1:Math.min(loaded/total,t/MIN);
   shown+=(target-shown)*.14;
   if(target===1&&shown>.985)return finish();
   count.textContent=Math.round(shown*100);
   paws.forEach((p,i)=>p.classList.toggle('on',shown*paws.length>i+.4));
   requestAnimationFrame(step);
  })(start);
 }
 runLoader();

 // Words become individual spans; <em> and <br> keep their place.
 function split(el){
  let i=0;
  (function walk(node){for(const c of [...node.childNodes]){
   if(c.nodeType===3){const f=document.createDocumentFragment();for(const t of c.textContent.split(/(\s+)/)){if(!t)continue;if(!t.trim()){f.append(' ');continue}const w=document.createElement('span'),s=document.createElement('span');w.className='w';w.style.setProperty('--i',i++);s.textContent=t;w.append(s);f.append(w)}c.replaceWith(f)}
   else if(c.nodeType===1&&c.tagName!=='BR')walk(c);
  }})(el);
  el.classList.add('split');
 }

 // Ribbons repeat their group until they outrun the viewport, then loop by one group width.
 const tracks=qa('.band-track');
 tracks.forEach(t=>{
  const g=t.firstElementChild,w=g.getBoundingClientRect().width;if(!w)return;
  for(let n=Math.ceil(innerWidth*1.15/w)+1;n>0;n--){const c=g.cloneNode(true);c.setAttribute('aria-hidden','true');t.append(c)}
  t.style.setProperty('--w',w+'px');t.style.animationDuration=w/55+'s';t.classList.add('run');
 });

 // Scenes: cached geometry, eased scroll position, direct transform writes.
 const scenes=[];
 const add=(el,fn)=>{if(el)scenes.push({el,fn,top:0,h:1})};
 let vh=innerHeight,y=scrollY,raf=0,rate=1;
 function frame(){
  raf=0;
  const ty=scrollY,d=ty-y;y=Math.abs(d)<.4?ty:y+d*.16;
  const live=on();
  if(live)for(const s of scenes){if(y+vh<s.top-vh*.5||y>s.top+s.h+vh*.5)continue;s.fn(clamp((y+vh-s.top)/(s.h+vh)),s)}
  rate+=((live?1+Math.min(7,Math.abs(d)*.11):1)-rate)*.12;
  if(live)for(const t of tracks){const a=t.getAnimations()[0];if(a)a.playbackRate=rate}
  if(y!==ty||Math.abs(rate-1)>.02)raf=requestAnimationFrame(frame);
 }
 const kick=()=>{if(!raf)raf=requestAnimationFrame(frame)};
 function measure(){vh=innerHeight;const sy=scrollY;for(const s of scenes){const r=s.el.getBoundingClientRect();s.top=r.top+sy;s.h=r.height}kick()}

 qa('[data-scene]').forEach(el=>{
  const items=qa('[data-px]',el).map(n=>[n,parseFloat(n.dataset.px)]);
  if(items.length)add(el,p=>{for(const [n,k] of items)n.style.transform=`translate3d(0,${((.5-p)*k*120).toFixed(1)}px,0)`});
 });

 const mani=q('.manifesto');
 if(mani){
  const panel=q('.manifesto-panel',mani),hint=q('.manifesto-hint',mani),text=q('.manifesto-text',mani);
  split(text);
  const words=qa('.w',text),tiles=qa('.tile',mani).map((n,i)=>[n,(i%2?-1:1)*(70+i*28),(i%2?1:-1)*(5+i*2)]);
  let lit=-1;
  add(mani,(p,s)=>{
   const enter=smooth(clamp((y+vh-s.top)/vh)),k=clamp((y-s.top)/Math.max(1,s.h-vh));
   panel.style.transform=`scale(${(.86+.14*enter).toFixed(4)})`;
   panel.style.borderRadius=((1-enter)*48).toFixed(1)+'px';
   hint.style.opacity=clamp(1-k*5);
   for(const [n,amp,rot] of tiles)n.style.transform=`translate3d(0,${((.5-k)*amp).toFixed(1)}px,0) rotate(${((k-.5)*rot).toFixed(2)}deg) scale(${(.8+.2*enter).toFixed(3)})`;
   const n=Math.round(clamp((k-.05)/.75)*words.length);
   if(n!==lit){words.forEach((w,i)=>w.classList.toggle('lit',i<n));lit=n}
  });
 }

 const trail=q('.paw-trail');
 if(trail){
  trail.innerHTML=icon('paw').repeat(clamp(Math.floor(trail.clientWidth/54),6,22));
  const paws=qa('svg',trail);let last=-1;
  add(q('.steps'),p=>{const n=Math.round(clamp((p-.2)/.4)*paws.length);if(n!==last){paws.forEach((x,i)=>x.classList.toggle('on',i<n));last=n}});
 }

 const orbit=q('.orbit');
 if(orbit)add(q('.story'),p=>orbit.style.setProperty('--spin',(p*220-110).toFixed(1)+'deg'));

 const mark=q('.wordmark');
 if(mark){
  mark.innerHTML=[...mark.textContent].map(c=>`<span>${c}</span>`).join('');
  const letters=qa('span',mark);
  add(mark,(p,s)=>{const k=clamp((y+vh-s.top)/s.h);letters.forEach((l,i)=>{l.style.transform=`translateY(${((1-smooth(clamp((k-.1-i*.05)/.4)))*105).toFixed(1)}%)`})});
 }

 const blobs=qa('.aura i');
 if(blobs.length)add(root,p=>{blobs[0].style.transform=`translate3d(${(p*34).toFixed(2)}vw,${(p*26).toFixed(2)}vh,0)`;blobs[1].style.transform=`translate3d(${(-p*30).toFixed(2)}vw,${(-p*40).toFixed(2)}vh,0)`;blobs[2].style.transform=`translate3d(${(p*18).toFixed(2)}vw,${(-p*48).toFixed(2)}vh,0)`});

 // Entrances: once, when the element is really on screen.
 if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}},{threshold:.2,rootMargin:'0px 0px -8% 0px'});
  qa('main h2').forEach(h=>{split(h);io.observe(h)});
  qa('.section-head p,.experience-heading p,.catalog-tools,.demo-note,.story-copy>p').forEach(el=>{el.classList.add('rv');io.observe(el)});
  qa('.faq details').forEach((el,i)=>{el.classList.add('rv');el.style.setProperty('--i',i);io.observe(el)});
 }

 // Pointer depth, precise pointers only.
 if(fine.matches){
  const hero=q('.hero');
  if(hero)hero.addEventListener('pointermove',e=>{if(!on())return;const r=hero.getBoundingClientRect();hero.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5).toFixed(3));hero.style.setProperty('--my',((e.clientY-r.top)/r.height-.5).toFixed(3))});
  qa('.hero .btn,.story .btn').forEach(b=>{
   b.addEventListener('pointermove',e=>{if(!on())return;const r=b.getBoundingClientRect();b.style.translate=`${(((e.clientX-r.left)/r.width-.5)*10).toFixed(1)}px ${(((e.clientY-r.top)/r.height-.5)*8).toFixed(1)}px`});
   b.addEventListener('pointerleave',()=>{b.style.translate=''});
  });
  const grid=q('#products');let tilt=0;
  if(grid){
   grid.addEventListener('pointermove',e=>{
    const art=e.target.closest('.product-art');if(!art||tilt||!on())return;
    tilt=requestAnimationFrame(()=>{tilt=0;const r=art.getBoundingClientRect();art.style.transform=`perspective(900px) rotateX(${(((e.clientY-r.top)/r.height-.5)*-7).toFixed(2)}deg) rotateY(${(((e.clientX-r.left)/r.width-.5)*9).toFixed(2)}deg)`});
   });
   grid.addEventListener('pointerout',e=>{const art=e.target.closest('.product-art');if(art&&!art.contains(e.relatedTarget))art.style.transform=''});
  }
 }

 addEventListener('scroll',kick,{passive:true});
 addEventListener('resize',measure,{passive:true});
 if('ResizeObserver' in window)new ResizeObserver(measure).observe(document.body);
 const control=q('#motionControl');if(control)control.addEventListener('click',()=>setTimeout(measure));
 measure();
})();
