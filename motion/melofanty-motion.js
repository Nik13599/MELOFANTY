/* MELOFANTY lightweight motion layer: non-blocking enhancement for the existing static pages. */
(function () {
 'use strict';
 var doc=document,html=doc.documentElement;
 if(html.hasAttribute('data-mf-motion'))return;
 html.setAttribute('data-mf-motion','1');
 var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 var fine=window.matchMedia&&window.matchMedia('(hover: hover) and (pointer: fine)').matches;
 var isHome=!!doc.getElementById('hero');
 var isAdmin=!!doc.getElementById('app')&&!!doc.querySelector('.mast');
 var isEvents=!!doc.getElementById('grid')&&!!doc.querySelector('main .toolbar');
 var isGame=!!doc.getElementById('gameStage');
 function each(selector,fn,root){(root||doc).querySelectorAll(selector).forEach(fn);}
 function aurora(){
  var nodes=isHome?'.hero,.try-panel,.cta':isEvents?'main':isAdmin?'main':'';
  if(!nodes)return;
  each(nodes,function(el){
   if(el.querySelector(':scope > .mf-aurora-layer'))return;
   var layer=doc.createElement('span');layer.className='mf-aurora-layer';layer.setAttribute('aria-hidden','true');
   if(isEvents||isAdmin){layer.style.opacity='.12';layer.style.height='min(380px,85vh)';layer.style.bottom='auto';}
   el.appendChild(layer);
  });
 }
 function reveals(){
  if(reduce||!('IntersectionObserver' in window))return;
  var candidates=isHome?'.hero-copy,.hero-energy,.try-left,.try-main,.events .section-bar,.how-title,.how-lead,.steps,.how-play,.stats,.cta>div,.cta>.main-btn,.event-list>.event-card':
   isEvents?'main>.overline,main>h1,main>.subtitle,main>.toolbar,#grid>.card':
   isAdmin?'#app>.heading,#app>.stats,#app>.event-grid>.event-card,#app>.event-grid,#app>.empty':'';
  if(!candidates)return;
  var observer=new IntersectionObserver(function(entries){
   entries.forEach(function(entry){
    if(entry.isIntersecting){entry.target.classList.add('mf-in-view');observer.unobserve(entry.target);}
   });
  },{root:null,threshold:0.06,rootMargin:'0px 0px 35px 0px'});
  function scan(){
   each(candidates,function(el,i){
    if(el.classList.contains('mf-reveal'))return;
    el.classList.add('mf-reveal');
    el.style.setProperty('--mf-delay',Math.min(i%4*65,195)+'ms');
    observer.observe(el);
   });
  }
  scan();
  requestAnimationFrame(function(){html.classList.add('mf-motion-ready');});
  var dynamic=isHome?doc.getElementById('eventList'):isEvents?doc.getElementById('grid'):isAdmin?doc.getElementById('app'):null;
  if(dynamic&&'MutationObserver' in window){
   var pending=false;
   new MutationObserver(function(){if(pending)return;pending=true;requestAnimationFrame(function(){pending=false;scan();});}).observe(dynamic,{childList:true,subtree:true});
  }
 }
 function spotlight(){
  if(!fine||reduce)return;
  var selectors=isHome?'.try-panel,.step,.event-list .mf-poster-frame,.stats .stat':
   isEvents?'#grid .card':isAdmin?'.event-grid .event-card,.stats .stat,.registration':'';
  if(!selectors)return;
  function enrich(root){
   each(selectors,function(el){
    if(el.classList.contains('mf-spotlight'))return;
    el.classList.add('mf-spotlight');
    var glow=doc.createElement('span');glow.className='mf-spotlight-glow';glow.setAttribute('aria-hidden','true');
    el.appendChild(glow);
   },root);
  }
  enrich(doc);
  doc.addEventListener('pointermove',function(e){
   if(e.pointerType!=='mouse')return;
   var t=e.target.closest&&e.target.closest('.mf-spotlight');
   if(!t)return;
   var r=t.getBoundingClientRect();
   t.style.setProperty('--mf-spot-x',(e.clientX-r.left).toFixed(1)+'px');
   t.style.setProperty('--mf-spot-y',(e.clientY-r.top).toFixed(1)+'px');
  },{passive:true});
  var target=isHome?doc.getElementById('eventList'):isEvents?doc.getElementById('grid'):isAdmin?doc.getElementById('app'):null;
  if(target&&'MutationObserver' in window){
   var pending=false;
   new MutationObserver(function(){if(pending)return;pending=true;requestAnimationFrame(function(){pending=false;enrich(doc);});}).observe(target,{childList:true,subtree:true});
  }
 }
 function ripples(){
  if(reduce)return;
  var q='.main-btn,.outline-btn,.try-action,.how-play,.all-events,.nav-arrow,.step,.back,.action,.btn,.mf-submit,.mf-secondary,.screen-icon,.screen-exit';
  doc.addEventListener('pointerdown',function(e){
   var el=e.target.closest&&e.target.closest(q);
   if(!el||el.disabled||el.closest('[hidden]'))return;
   var box=el.getBoundingClientRect(),d=doc.createElement('span');
   el.classList.add('mf-clickable');d.className='mf-ripple';d.setAttribute('aria-hidden','true');
   d.style.left=(e.clientX-box.left)+'px';d.style.top=(e.clientY-box.top)+'px';
   el.appendChild(d);d.addEventListener('animationend',function(){d.remove();},{once:true});
  },{passive:true});
 }
 function menu(){
  var nav=doc.getElementById('navigation'),toggle=doc.getElementById('menuToggle');
  if(!nav||!toggle)return;
  each('#navigation a',function(a,i){a.style.setProperty('--mf-menu-i',i);});
  var scrim=doc.createElement('div');scrim.className='mf-menu-scrim';scrim.setAttribute('aria-hidden','true');doc.body.appendChild(scrim);
  function sync(){
   var open=nav.classList.contains('open')&&window.matchMedia('(max-width:820px)').matches;
   scrim.classList.toggle('mf-menu-open',open);
   toggle.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
  }
  scrim.addEventListener('click',function(){if(nav.classList.contains('open'))toggle.click();});
  new MutationObserver(sync).observe(nav,{attributes:true,attributeFilter:['class']});
  window.addEventListener('resize',sync,{passive:true});sync();
 }
 function parallax(){
  if(!isHome||!fine||reduce)return;
  var hero=doc.getElementById('hero'),panel=doc.getElementById('try'),how=doc.getElementById('how');
  html.classList.add('mf-parallax');
  function track(el,xName,yName,range){
   if(!el)return;
   var raf=0,x=0,y=0;
   el.addEventListener('pointermove',function(e){
    var r=el.getBoundingClientRect();
    x=((e.clientX-r.left)/Math.max(r.width,1)-.5)*range;
    y=((e.clientY-r.top)/Math.max(r.height,1)-.5)*range;
    if(raf)return;
    raf=requestAnimationFrame(function(){raf=0;html.style.setProperty(xName,x.toFixed(1)+'px');html.style.setProperty(yName,y.toFixed(1)+'px');});
   },{passive:true});
   el.addEventListener('pointerleave',function(){html.style.setProperty(xName,'0px');html.style.setProperty(yName,'0px');},{passive:true});
  }
  track(hero,'--mf-hero-x','--mf-hero-y',15);
  track(panel,'--mf-die-x','--mf-die-y',13);
  track(how,'--mf-disco-x','--mf-disco-y',10);
 }
 function smoke(){
  if(reduce||!fine||isGame||window.innerWidth<900||doc.visibilityState==='hidden')return;
  if(navigator.deviceMemory&&navigator.deviceMemory<=2)return;
  var c=doc.createElement('canvas');c.className='mf-smoke';c.setAttribute('aria-hidden','true');
  var ctx=c.getContext('2d',{alpha:true});if(!ctx)return;
  doc.body.appendChild(c);
  var dpr=1,w=0,h=0,items=[],frame=0,last=0;
  var sprite=doc.createElement('canvas');sprite.width=sprite.height=80;
  var sc=sprite.getContext('2d'),g=sc.createRadialGradient(40,40,0,40,40,40);
  g.addColorStop(0,'rgba(111,255,170,.42)');g.addColorStop(.35,'rgba(32,235,202,.2)');g.addColorStop(1,'rgba(20,232,184,0)');
  sc.fillStyle=g;sc.fillRect(0,0,80,80);
  function size(){
   dpr=Math.min(window.devicePixelRatio||1,1.5);w=innerWidth;h=innerHeight;
   c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);
   ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function render(now){
   frame=0;ctx.clearRect(0,0,w,h);
   items=items.filter(function(p){
    var age=(now-p.t)/820;if(age>=1)return false;
    var a=(1-age)*.42;
    ctx.globalAlpha=a;var r=p.r*(.6+age*1.6);
    ctx.drawImage(sprite,p.x-r/2+p.vx*age*12,p.y-r/2-age*21,r,r);
    return true;
   });
   ctx.globalAlpha=1;
   if(items.length)frame=requestAnimationFrame(render);
  }
  doc.addEventListener('pointermove',function(e){
   if(e.pointerType!=='mouse'||doc.hidden||e.timeStamp-last<23)return;last=e.timeStamp;
   items.push({x:e.clientX,y:e.clientY,t:performance.now(),r:43+Math.random()*24,vx:Math.random()*2-1});
   if(items.length>42)items.splice(0,items.length-42);
   if(!frame)frame=requestAnimationFrame(render);
  },{passive:true});
  window.addEventListener('resize',size,{passive:true});
  doc.addEventListener('visibilitychange',function(){if(doc.hidden){items=[];if(frame)cancelAnimationFrame(frame);frame=0;ctx.clearRect(0,0,w,h);}});
  size();
 }
 function dialogMotion(){
  // The actual dialogs, focus management and API calls are still controlled by the existing application.
  doc.addEventListener('click',function(e){
   var btn=e.target.closest&&e.target.closest('.mf-close,.close-modal,.close,.help-close');
   if(btn)btn.blur();
  },{passive:true});
 }
 aurora();reveals();spotlight();ripples();menu();parallax();smoke();dialogMotion();
})();