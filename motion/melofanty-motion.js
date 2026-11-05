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
  var nodes=isHome?'.hero,.try-panel,.cta':isEvents?'main':isAdmin?'.mast':'';
  if(!nodes)return;
  each(nodes,function(el){
   if(el.querySelector(':scope > .mf-aurora-layer'))return;
   var layer=doc.createElement('span');layer.className='mf-aurora-layer';layer.setAttribute('aria-hidden','true');
   if(isEvents){el.style.position='relative';layer.style.opacity='.12';layer.style.height='min(380px,85vh)';layer.style.bottom='auto';}
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
  if(reduce||doc.visibilityState==='hidden')return;
  var c=doc.createElement('canvas');c.className='mf-smoke';c.setAttribute('aria-hidden','true');
  var ctx=c.getContext('2d',{alpha:true});if(!ctx)return;
  doc.body.appendChild(c);
  var mobile=window.matchMedia('(pointer:coarse)').matches;
  var dpr=1,w=0,h=0,items=[],frame=0,last=0,previous=null;
  var sprite=doc.createElement('canvas');sprite.width=sprite.height=96;
  var sc=sprite.getContext('2d');
  var g=sc.createRadialGradient(48,48,0,48,48,48);
  g.addColorStop(0,'rgba(113,255,175,.35)');
  g.addColorStop(.24,'rgba(48,248,186,.25)');
  g.addColorStop(.58,'rgba(24,218,196,.08)');
  g.addColorStop(1,'rgba(19,214,179,0)');
  sc.fillStyle=g;sc.fillRect(0,0,96,96);
  function size(){
    mobile=window.matchMedia('(pointer:coarse)').matches;
    dpr=Math.min(window.devicePixelRatio||1,mobile?1.25:1.5);
    w=innerWidth;h=innerHeight;
    c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function render(now){
    frame=0;ctx.clearRect(0,0,w,h);
    var lifetime=mobile?740:880;
    items=items.filter(function(p){
      var age=(now-p.t)/lifetime;if(age>=1)return false;
      ctx.globalAlpha=(1-age)*.46;
      var r=p.r*(.72+age*1.65);
      ctx.drawImage(sprite,p.x-r/2+p.vx*age*13,p.y-r/2-age*21,r,r);
      return true;
    });
    ctx.globalAlpha=1;
    if(items.length)frame=requestAnimationFrame(render);
  }
  function spawn(x,y,touch){
    var now=performance.now(),delay=touch?28:19;
    if(now-last<delay)return;
    last=now;
    var dx=previous&&previous.touch===touch?x-previous.x:0;
    var dy=previous&&previous.touch===touch?y-previous.y:0;
    var dist=Math.hypot(dx,dy);
    var count=dist>160?1:Math.min(touch?5:4,Math.max(1,Math.ceil(dist/17)));
    for(var i=1;i<=count;i++){
      var t=i/count;
      items.push({x:x-dx*(1-t),y:y-dy*(1-t),t:now-(count-i)*17,
        r:(touch?48:52)+Math.random()*15,vx:Math.random()*2-1});
    }
    previous={x:x,y:y,touch:touch};
    var max=mobile?38:58;
    if(items.length>max)items.splice(0,items.length-max);
    if(!frame)frame=requestAnimationFrame(render);
  }
  doc.addEventListener('pointermove',function(e){
    if(e.pointerType==='touch'||doc.hidden)return;
    spawn(e.clientX,e.clientY,false);
  },{passive:true});
  doc.addEventListener('touchstart',function(e){
    previous=null;
    if(e.touches.length===1&&!doc.hidden)spawn(e.touches[0].clientX,e.touches[0].clientY,true);
  },{passive:true});
  doc.addEventListener('touchmove',function(e){
    if(e.touches.length===1&&!doc.hidden)spawn(e.touches[0].clientX,e.touches[0].clientY,true);
  },{passive:true});
  doc.addEventListener('touchend',function(){previous=null;},{passive:true});
  doc.addEventListener('touchcancel',function(){previous=null;},{passive:true});
  window.addEventListener('resize',size,{passive:true});
  doc.addEventListener('visibilitychange',function(){
    if(doc.hidden){items=[];previous=null;if(frame)cancelAnimationFrame(frame);frame=0;ctx.clearRect(0,0,w,h);}
  });
  size();
 }
 aurora();reveals();spotlight();ripples();menu();parallax();smoke();
})();