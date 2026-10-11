'use strict';
/* Progressive enhancement. All content is visible without this file.
   No intercepted scrolling, no animation library, no perpetual RAF loop. */
(()=>{
 const root=document.documentElement;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const desktop=matchMedia('(min-width: 761px)');
 let paused=false,keyboard=false;
 try{paused=sessionStorage.getItem('perritual-motion')==='paused'}catch{}
 const enabled=()=>!reduced.matches&&!paused;
 const interaction=()=>enabled()&&!keyboard;
 const out='cubic-bezier(.16,1,.3,1)',drawerCurve='cubic-bezier(.32,.72,0,1)';
 const animating=new Set();
 function play(el,frames,options={}){
  if(!el||!enabled()||typeof el.animate!=='function')return null;
  const animation=el.animate(frames,{duration:240,easing:out,...options});
  animating.add(animation);
  animation.finished.catch(()=>{}).finally(()=>animating.delete(animation));
  return animation;
 }
 function syncMotion(){root.dataset.motion=paused||reduced.matches?'paused':'active';$('#motionControl').setAttribute('aria-pressed',String(paused||reduced.matches));$('#motionControl').textContent=reduced.matches?'Movimiento reducido':paused?'Activar efectos':'Pausar efectos';$('#motionControl').disabled=reduced.matches;if(!enabled())for(const a of animating)a.cancel()}
 syncMotion();reduced.addEventListener('change',syncMotion);
 document.addEventListener('keydown',()=>{keyboard=true;root.dataset.input='keyboard'},true);
 document.addEventListener('pointerdown',()=>{keyboard=false;root.dataset.input='pointer'},true);
 $('#motionControl').addEventListener('click',()=>{paused=!paused;try{sessionStorage.setItem('perritual-motion',paused?'paused':'active')}catch{}syncMotion();toast(paused?'Efectos pausados':'Efectos activados')});
 // Dialogs keep the native focus trap, Escape behavior and focus restoration.
 const nativeOpen=openDialog,nativeClose=closeDialog;
 openDialog=function(el){el._closingToken=null;el.getAnimations().forEach(a=>a.cancel());delete el.dataset.closing;nativeOpen(el);if(!interaction())return;const isDrawer=el.classList.contains('drawer');play(el,isDrawer?[{transform:'translateX(100%)',opacity:.7},{transform:'translateX(0)',opacity:1}]:[{transform:'translateY(16px) scale(.975)',opacity:0},{transform:'translateY(0) scale(1)',opacity:1}],{duration:isDrawer?290:230,easing:isDrawer?drawerCurve:out})};
 closeDialog=function(el){if(!el.open||el.dataset.closing)return;if(!interaction()){nativeClose(el);return}el.dataset.closing='true';el.getAnimations().forEach(a=>a.cancel());const isDrawer=el.classList.contains('drawer');const a=play(el,isDrawer?[{transform:'translateX(0)',opacity:1},{transform:'translateX(100%)',opacity:.7}]:[{transform:'translateY(0) scale(1)',opacity:1},{transform:'translateY(10px) scale(.985)',opacity:0}],{duration:160});const closingToken={};el._closingToken=closingToken;const done=()=>{if(el._closingToken!==closingToken)return;delete el.dataset.closing;if(el.open)nativeClose(el)};if(a)a.finished.then(done,done);else done()};
 $$('dialog').forEach(d=>{d.addEventListener('cancel',e=>{e.preventDefault();closeDialog(d)});d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(d)})});
 // Confirm quantity changes without animating the whole cart.
 const originalPersist=persist;
 persist=function(){const before=$('#count').textContent;originalPersist();if(before!==$('#count').textContent&&interaction())play($('#count'),[{transform:'scale(1)',opacity:.6},{transform:'scale(1.18)',opacity:1},{transform:'scale(1)',opacity:1}],{duration:220})};
 // A new result set and a checkout step are genuine changes of state.
 const originalProducts=renderProducts;
 renderProducts=function(){originalProducts();if(interaction())$$('.product-card').forEach((el,i)=>play(el,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,delay:Math.min(i,3)*35}));bindSpotlights()};
 const originalCheckout=renderCheckout;
 renderCheckout=function(step){const previous=checkoutStep;originalCheckout(step);if(interaction()){play($('#checkoutContent'),[{opacity:0,transform:`translateX(${step<previous?-12:12}px)`},{opacity:1,transform:'translateX(0)'}],{duration:220});if(step===3)play($('.success-icon'),[{opacity:0,transform:'scale(.9)'},{opacity:1,transform:'scale(1)'}],{duration:350,delay:80})}const heading=$('#checkoutTitle');heading.setAttribute('tabindex','-1');if($('#checkoutDialog').open)heading.focus({preventScroll:true})};
 // Color changes update the physical card instead of recreating the entire photo.
 updateDraft=function(){const f=$('#productForm');if(currentProduct.custom){for(const key of ['name','age','size','flavor','decoration','message'])if(f.elements[key])draft[key]=f.elements[key].value;if(f.elements.toy)draft.toy=f.elements.toy.checked}const preview=$('#liveArt .personal-preview');if(preview){preview.style.setProperty('--chosen',colors[draft.color]||colors.Durazno);preview.querySelector('strong').textContent=draft.name||'Tu mejor amigo';preview.querySelector('small').textContent=[draft.age?draft.age+' años':'',draft.color,draft.size].filter(Boolean).join(' · ')}$('#draftPrice').textContent=Money(Rules.unit({id:currentProduct.id,options:draft}))};
 // Spotlight only on precise pointers. One queued write per frame, no component render.
 function bindSpotlights(){if(!fine.matches)return;$$('.product-art').forEach(el=>{if(el.dataset.spotlight)return;el.dataset.spotlight='true';let frame=0,px=0,py=0;el.addEventListener('pointermove',e=>{if(!enabled())return;const r=el.getBoundingClientRect();px=e.clientX-r.left;py=e.clientY-r.top;if(frame)return;frame=requestAnimationFrame(()=>{el.style.setProperty('--mx',px+'px');el.style.setProperty('--my',py+'px');frame=0})});el.addEventListener('pointerleave',()=>{if(frame)cancelAnimationFrame(frame);frame=0})})}
 bindSpotlights();
 // The focal sequence: the customer discovers the kit in three consecutive chapters.
 let activeChapter=0;
 const chapters=$$('.chapter'),photos=$$('.stage-photo'),tabs=$$('[data-chapter-link]');
 function setChapter(index){activeChapter=index;$('.ritual-experience').dataset.scene=String(index);$('#sceneNumber').textContent=String(index+1).padStart(2,'0')+' / 03';photos.forEach((el,i)=>{el.classList.toggle('active',i===index);el.setAttribute('aria-hidden',String(i!==index))});tabs.forEach((el,i)=>{el.classList.toggle('active',i===index);el.setAttribute('aria-pressed',String(i===index))});chapters.forEach((el,i)=>el.classList.toggle('active',i===index))}
 setChapter(0);
 // One scheduled frame per scroll event, no wheel interception or animation loop.
 const experience=$('.ritual-experience'),stage=$('.experience-stage');
 let scrollFrame=0;
 function updateScroll(){
  scrollFrame=0;
  const h=window.innerHeight||800,rect=experience.getBoundingClientRect();
  if(rect.bottom>0&&rect.top<h){
   const target=desktop.matches?h*.52:Math.min(h*.8,stage.getBoundingClientRect().bottom+80);
   let index=0;chapters.forEach((c,i)=>{if(c.getBoundingClientRect().top<=target)index=i});
   if(index!==activeChapter)setChapter(index);
   const progress=Math.max(0,Math.min(1,(h*.6-rect.top)/Math.max(1,rect.height-h*.4)));
   experience.style.setProperty('--journey',progress);
   experience.style.setProperty('--orbit-turn',enabled()?(progress*110-35)+'deg':'0deg');
  }
 }
 function scheduleScroll(){if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll)}
 window.addEventListener('scroll',scheduleScroll,{passive:true});
 window.addEventListener('resize',scheduleScroll,{passive:true});
 reduced.addEventListener('change',scheduleScroll);
 $('#motionControl').addEventListener('click',scheduleScroll);
 scheduleScroll();
 tabs.forEach(tab=>tab.addEventListener('click',()=>{const i=Number(tab.dataset.chapterLink);setChapter(i);chapters[i].scrollIntoView({behavior:interaction()?'smooth':'instant',block:desktop.matches?'center':'end'})}));
 // Entrances: just the hero and meaningful section headings, once, with a visible fallback.
 function heroEnter(){if(!enabled())return;const lines=$$('.headline-line');lines.forEach((el,i)=>play(el,[{opacity:.15,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:620,delay:i*70}));play($('.hero-frame'),[{opacity:.35,transform:'rotate(0deg) translateY(20px) scale(.975)'},{opacity:1,transform:desktop.matches?'rotate(2deg) translateY(0) scale(1)':'rotate(1.8deg) translateY(0) scale(1)'}],{duration:750});play($('.hero-copy>p'),[{opacity:0},{opacity:1}],{duration:450,delay:100})}
 heroEnter();
 if('IntersectionObserver' in window){const reveal=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){if(enabled())play(entry.target,[{opacity:.15,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:550});reveal.unobserve(entry.target)}},{threshold:.15});$$('.section-head h2,.experience-heading h2,.story h2').forEach(el=>reveal.observe(el));
 const headerObserver=new IntersectionObserver(entries=>{$('header').classList.toggle('scrolled',!entries[0].isIntersecting)},{threshold:0});headerObserver.observe($('.announcement'));
 const navObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)$$('nav a').forEach(a=>a.setAttribute('aria-current',String(a.getAttribute('href')==='#'+entry.target.id)))},{rootMargin:'-15% 0px -60% 0px',threshold:0});['catalogo','ritual','historia'].forEach(id=>navObserver.observe($('#'+id)))}
 // Native accordions, softened without replacing keyboard or disclosure semantics.
 $$('.faq details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open&&interaction())play(d.querySelector('p'),[{opacity:0,transform:'translateY(-4px)'},{opacity:1,transform:'translateY(0)'}],{duration:180})}));
 document.addEventListener('visibilitychange',()=>{for(const a of animating){if(document.hidden)a.pause();else a.play()}});
})();
