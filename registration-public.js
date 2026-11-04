/* Injected into the existing MELOFANTY landing page. */
(function(){
'use strict';
var events=[],index=0,active=null,receipt=null;
var styles=document.createElement('style');
styles.textContent=[
'.mf-overlay{position:fixed;inset:0;z-index:9000;background:#000d;backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;padding:12px;overflow:auto}',
'.mf-overlay[hidden]{display:none!important}.mf-dialog{width:min(100%,480px);max-height:calc(100dvh - 24px);overflow:auto;border:1px solid #35e8be;border-radius:25px;background:linear-gradient(150deg,#092b24,#01120e 76%);padding:clamp(18px,4vw,30px);box-shadow:0 16px 90px #000b;color:#f7fff5}',
'.mf-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.mf-logo{font:700 27px Oswald,sans-serif;letter-spacing:.04em}.mf-close{background:#17382d;color:white;border:1px solid #3aa784;border-radius:50%;width:36px;height:36px;font-size:23px;flex:none}',
'.mf-tag{display:block;color:#85ffae;font:600 13px Oswald,sans-serif;letter-spacing:.11em;margin:20px 0 4px}.mf-title{font:700 clamp(26px,7vw,40px)/1.1 Oswald,sans-serif}.mf-meta{color:#b1cfc4;margin:8px 0 20px;font-size:16px}',
'.mf-form{display:grid;gap:13px}.mf-field{display:grid;gap:5px;color:#c7f3e3;font:500 15px Oswald,sans-serif}.mf-field input{width:100%;min-height:48px;background:#061e18;color:white;border:1px solid #267e64;border-radius:12px;padding:0 14px;font:400 17px Roboto Condensed,Arial,sans-serif;outline:none}.mf-field input:focus{border-color:#b8ff76}',
'.mf-submit{min-height:51px;border-radius:40px;border:0;background:linear-gradient(100deg,#75f770,#b8ff7d);color:#092314;font:700 19px Oswald,sans-serif;padding:0 18px}.mf-submit:disabled{opacity:.6}',
'.mf-note{color:#9ebfb2;font-size:13px;line-height:1.45}.mf-error{color:#ffb6a9;font-size:14px;min-height:18px}',
'.mf-ticket{background:radial-gradient(ellipse at top right,#185842,#061710 73%);border:1px solid #4becab;border-radius:20px;padding:24px 18px;text-align:center;margin:18px 0;box-shadow:0 0 34px #37ffa51d}',
'.mf-ticket img{width:75px;height:75px;object-fit:contain;margin:0 auto 8px}.mf-ticket .mf-tbrand{font:700 30px Oswald,sans-serif}.mf-ticket .mf-status{font:600 18px Oswald,sans-serif;color:#a8ff79;margin:14px 0 7px}',
'.mf-ticket .mf-number{font:700 clamp(35px,10vw,54px) Oswald,sans-serif;color:#f2fff4;letter-spacing:.03em;margin:10px 0}.mf-ticket .mf-people{font:600 22px Oswald,sans-serif}.mf-ticket .mf-when{color:#c7e2cf;font-size:15px;margin-top:12px}',
'.mf-download{display:flex;gap:8px}.mf-download button{flex:1}.mf-download .mf-secondary{background:transparent;color:#d8ffe5;border:1px solid #68d5aa;border-radius:30px;padding:10px}',
'.mf-empty{min-height:240px;border:1px solid #185e49;border-radius:23px;padding:36px 22px;display:flex;align-items:center;justify-content:center;text-align:center;grid-column:1/-1;background:linear-gradient(145deg,#02130f,#0a2920)}',
'.mf-empty strong{font:700 26px Oswald,sans-serif}.mf-empty p{color:#afcec4;margin-top:8px;font-size:17px}',
'.mf-description{border:1px solid #286d52;border-radius:13px;background:#09271a;padding:12px;color:#cce9d7;line-height:1.4;white-space:pre-wrap;margin:3px 0 18px}',
'.event-list.mf-single-event{grid-template-columns:minmax(0,min(410px,100%))!important;justify-content:center}',
'.mf-event-hint{font:600 12px Oswald,sans-serif;color:#a9ff83;border:1px solid #7cffa060;border-radius:9px;padding:4px 7px;position:absolute;right:9px;top:9px;background:#012018cc}',
'@media(max-width:760px){.mf-overlay{padding:8px}.mf-dialog{max-height:calc(100dvh - 16px)}.mf-title{font-size:29px}.mf-field input{min-height:45px}}'
].join('');
document.head.appendChild(styles);
var backdrop=document.createElement('div');backdrop.className='mf-overlay';backdrop.hidden=true;
backdrop.innerHTML='<div class="mf-dialog" role="dialog" aria-modal="true" aria-label="Регистрация МЕЛОФАНТЫ"><div class="mf-head"><div class="mf-logo">МЕЛОФАНТЫ</div><button type="button" class="mf-close" aria-label="Закрыть">×</button></div><div id="mf-dialog-body"></div></div>';
document.body.appendChild(backdrop);
var dialogBody=backdrop.querySelector('#mf-dialog-body');
function el(tag,cls,text){var node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;}
function localDate(s){return new Date(s).toLocaleString('ru-RU',{timeZone:'Europe/Minsk',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});}
function peopleText(n){return n+' '+(n%10===1&&n%100!==11?'человек':n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?'человека':'человек');}
function open(){backdrop.hidden=false;document.body.style.overflow='hidden';var close=backdrop.querySelector('.mf-close');if(close)close.focus();}
function close(){backdrop.hidden=true;document.body.style.overflow='';active=null;}
backdrop.querySelector('.mf-close').addEventListener('click',close);
backdrop.addEventListener('click',function(e){if(e.target===backdrop)close();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!backdrop.hidden)close();});
function eventForm(e){
 active=e;receipt=null;dialogBody.replaceChildren();
 dialogBody.append(el('span','mf-tag','СВОБОДНАЯ РЕГИСТРАЦИЯ'));
 dialogBody.append(el('h2','mf-title',e.title));
 dialogBody.append(el('p','mf-meta',localDate(e.starts_at)+' · '+e.venue));
 if(e.description)dialogBody.append(el('p','mf-description',e.description));
 var f=el('form','mf-form');
 f.innerHTML='<label class="mf-field">ВАШЕ ИМЯ<input name="name" autocomplete="name" maxlength="100" required minlength="2" placeholder="Как к вам обращаться?"></label><label class="mf-field">НОМЕР ТЕЛЕФОНА<input name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="40" required placeholder="+375 29 000 00 00"></label><label class="mf-field">КОЛИЧЕСТВО ЧЕЛОВЕК<input name="party_size" type="number" inputmode="numeric" min="1" max="50" step="1" value="1" required></label><input name="website" style="display:none" tabindex="-1" autocomplete="off"><p class="mf-note">Данные используются организаторами для обработки регистрации на выбранное мероприятие. Личный кабинет не требуется.</p><div class="mf-error" role="alert"></div><button type="submit" class="mf-submit">ЗАРЕГИСТРИРОВАТЬСЯ →</button>';
 dialogBody.append(f);open();
 f.addEventListener('submit',async function(ev){
  ev.preventDefault();var btn=f.querySelector('button[type=submit]'),err=f.querySelector('.mf-error');
  btn.disabled=true;btn.textContent='ОТПРАВЛЯЕМ…';err.textContent='';
  var p={event_id:e.id,name:f.elements.name.value,phone:f.elements.phone.value,party_size:Number(f.elements.party_size.value),website:f.elements.website.value};
  try{
   var response=await fetch('/api/registration/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)});
   var result=await response.json();if(!response.ok)throw new Error(result.error||'Не удалось зарегистрироваться');
   receipt=result;showReceipt(result);
  }catch(ex){err.textContent=ex.message||'Ошибка соединения. Проверьте интернет и обратитесь к организатору.';}
  finally{btn.disabled=false;btn.textContent='ЗАРЕГИСТРИРОВАТЬСЯ →';}
 });
}
function showReceipt(d){
 dialogBody.replaceChildren();
 dialogBody.append(el('span','mf-tag','РЕГИСТРАЦИЯ УСПЕШНО ПРОЙДЕНА'));
 dialogBody.append(el('h2','mf-title','ВАШ НОМЕР РЕГИСТРАЦИИ'));
 var ticket=el('div','mf-ticket');
 var logo=document.querySelector('.brand-icon');if(logo){var copy=logo.cloneNode(true);copy.removeAttribute('class');ticket.append(copy);}
 ticket.append(el('div','mf-tbrand','МЕЛОФАНТЫ'));
 ticket.append(el('div','mf-status','✓ ВАША ЗАЯВКА ПРИНЯТА'));
 ticket.append(el('div','mf-number','ID '+d.code));
 ticket.append(el('div','mf-people',peopleText(d.party_size)));
 ticket.append(el('div','mf-when',d.title+' · '+localDate(d.starts_at)));
 dialogBody.append(ticket);
 dialogBody.append(el('p','mf-note','Регистрация отправлена организатору и ожидает подтверждения. Сохраните номер ID, чтобы предъявить его при необходимости.'));
 var actions=el('div','mf-download');
 var save=el('button','mf-submit','СОХРАНИТЬ В ГАЛЕРЕЮ');
 save.type='button';save.addEventListener('click',function(){saveTicket(d);});
 actions.append(save);dialogBody.append(actions);
 var done=el('button','mf-secondary','Закрыть');done.type='button';done.style.marginTop='12px';done.style.width='100%';done.addEventListener('click',close);dialogBody.append(done);
}
async function saveTicket(d){
 var canvas=document.createElement('canvas');canvas.width=1000;canvas.height=1300;var c=canvas.getContext('2d');
 c.fillStyle='#04140e';c.fillRect(0,0,1000,1300);
 var gradient=c.createRadialGradient(780,140,20,780,140,780);gradient.addColorStop(0,'#186746');gradient.addColorStop(1,'#04140e');c.fillStyle=gradient;c.fillRect(0,0,1000,1300);
 c.strokeStyle='#74e5ac';c.lineWidth=4;c.beginPath();c.roundRect(55,55,890,1190,45);c.stroke();
 var logo=document.querySelector('.brand-icon');
 if(logo){try{await logo.decode();c.drawImage(logo,403,135,194,194);}catch(e){}}
 c.textAlign='center';c.fillStyle='#f6fff7';c.font='bold 78px Oswald,Arial,sans-serif';c.fillText('МЕЛОФАНТЫ',500,440);
 c.fillStyle='#9eff80';c.font='bold 37px Oswald,Arial,sans-serif';c.fillText('РЕГИСТРАЦИЯ УСПЕШНА',500,555);
 c.fillStyle='#fff';c.font='bold 97px Oswald,Arial,sans-serif';c.fillText('ID '+d.code,500,720);
 c.fillStyle='#9eff80';c.font='bold 52px Oswald,Arial,sans-serif';c.fillText(peopleText(d.party_size),500,818);
 c.fillStyle='#d0eade';c.font='38px Arial,sans-serif';c.fillText(localDate(d.starts_at),500,935);
 c.font='bold 39px Oswald,Arial,sans-serif';
 var title=String(d.title||'').slice(0,32);c.fillText(title,500,1010,820);
 c.fillStyle='#a2caba';c.font='28px Arial,sans-serif';c.fillText('Сохраните эту карточку до мероприятия',500,1145);
 var blob=await new Promise(function(resolve){canvas.toBlob(resolve,'image/png');});
 if(!blob)return;
 var file=new File([blob],'MELOFANTY-'+d.code+'.png',{type:'image/png'});
 if(navigator.canShare&&navigator.canShare({files:[file]})){
  try{await navigator.share({files:[file],title:'МЕЛОФАНТЫ · ID '+d.code});return;}catch(err){if(err.name==='AbortError')return;}
 }
 var url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=file.name;
 document.body.appendChild(link);link.click();link.remove();
 setTimeout(function(){URL.revokeObjectURL(url);},60000);
 var msg=el('p','mf-note','Если изображение открылось отдельно, удерживайте его и выберите «Сохранить в Фото».');dialogBody.append(msg);
}
function buildCard(e){
 var button=el('button','event-card');button.type='button';
 var poster=e.poster;if(poster){var img=el('img');img.src=poster;img.alt='Афиша: '+e.title;img.loading='lazy';button.append(img);}
 button.append(el('span','mf-event-hint','РЕГИСТРАЦИЯ'));
 var info=el('span','event-info');info.append(el('span','event-title',e.title));
 info.append(el('span','event-date',new Date(e.starts_at).toLocaleDateString('ru-RU',{timeZone:'Europe/Minsk',day:'2-digit',month:'2-digit'})+' / '+new Date(e.starts_at).toLocaleTimeString('ru-RU',{timeZone:'Europe/Minsk',hour:'2-digit',minute:'2-digit'})));
 info.append(el('span','event-place','♧ '+e.venue));button.append(info);
 button.addEventListener('click',function(){eventForm(e);});return button;
}
function drawEvents(){
 var list=document.getElementById('eventList'),dots=document.getElementById('dots');if(!list||!dots)return;
 list.replaceChildren();dots.replaceChildren();
 if(!events.length){
  var box=el('div','mf-empty');var inside=el('div');inside.append(el('strong','','СКОРО НОВЫЕ ИГРЫ'));inside.append(el('p','','Следите за анонсами. Регистрация откроется после публикации нового мероприятия.'));box.append(inside);list.append(box);
  document.getElementById('eventsPrev').hidden=true;document.getElementById('eventsNext').hidden=true;return;
 }
 document.getElementById('eventsPrev').hidden=events.length<=3;document.getElementById('eventsNext').hidden=events.length<=3;
 var width=window.matchMedia('(max-width:760px)').matches?3:3;
 var start=events.length<=width?0:Math.min(index,events.length-width);
 var visible=events.slice(start,start+width);
 list.classList.toggle('mf-single-event',visible.length===1);
 list.style.gridTemplateColumns='repeat('+Math.min(visible.length,3)+',minmax(0,1fr))';
 visible.forEach(function(e){list.append(buildCard(e));});
 for(var i=0;i<events.length;i++){
  var dot=el('button');dot.type='button';dot.className=i===Math.min(index,events.length-1)?'current':'';
  dot.setAttribute('aria-label','Мероприятие '+(i+1));
  (function(n){dot.addEventListener('click',function(){index=n;drawEvents();});})(i);dots.append(dot);
 }
}
function move(n){if(!events.length)return;index=(index+n+events.length)%events.length;drawEvents();}
['eventsPrev','eventsNext'].forEach(function(id){
 var node=document.getElementById(id);if(node)node.addEventListener('click',function(e){e.stopImmediatePropagation();move(id==='eventsPrev'?-1:1);},true);
});
function openFirst(){if(events.length)eventForm(events[Math.min(index,events.length-1)]);else document.getElementById('events').scrollIntoView({behavior:'smooth',block:'start'});}
document.querySelectorAll('a.main-btn').forEach(function(a){
 if(/РЕГИСТРАЦИЯ|ЗАРЕГИСТРИРОВАТЬСЯ/i.test(a.textContent||'')){a.removeAttribute('target');a.setAttribute('href','#events');a.addEventListener('click',function(ev){ev.preventDefault();openFirst();},true);}
});
var all=document.getElementById('allEvents');
if(all)all.addEventListener('click',function(e){e.stopImmediatePropagation();if(events.length){index=0;drawEvents();document.getElementById('events').scrollIntoView({behavior:'smooth'});}},true);
var eventsFingerprint=null;
async function refreshEvents(){
 try{
  var response=await fetch('/api/registration/events',{cache:'no-store'});
  if(!response.ok)throw new Error('API');
  var data=await response.json();
  var next=Array.isArray(data.events)?data.events:[];
  var fingerprint=JSON.stringify(next);
  if(fingerprint!==eventsFingerprint){
   var oldId=events[index]&&events[index].id;
   events=next;
   index=Math.max(0,oldId?events.findIndex(function(e){return e.id===oldId;}):0);
   eventsFingerprint=fingerprint;
   drawEvents();
  }
 }catch(error){
  if(eventsFingerprint===null){
   var list=document.getElementById('eventList');
   if(list){list.replaceChildren();var box=el('div','mf-empty');box.append(el('p','','Не удалось получить актуальное расписание. Обновите страницу позже.'));list.append(box);}
  }
 }
}
refreshEvents();
window.addEventListener('focus',refreshEvents);
document.addEventListener('visibilitychange',function(){if(!document.hidden)refreshEvents();});
setInterval(function(){if(!document.hidden)refreshEvents();},90000);
})();