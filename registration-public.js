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
'.mf-form{display:grid;gap:13px}.mf-field{display:grid;gap:5px;color:#c7f3e3;font:500 15px Oswald,sans-serif}.mf-field input{width:100%;min-height:48px;background:#061e18;color:white;border:1px solid #267e64;border-radius:12px;padding:0 14px;font:400 17px Roboto Condensed,Arial,sans-serif;outline:none}.mf-field input:focus,.mf-field textarea:focus{border-color:#b8ff76}',
'.mf-field textarea{width:100%;min-height:82px;max-height:160px;resize:vertical;background:#061e18;color:#fff;border:1px solid #267e64;border-radius:12px;padding:12px 14px;font:400 16px Roboto Condensed,Arial,sans-serif;outline:none}',
'.mf-submit{min-height:51px;border-radius:40px;border:0;background:linear-gradient(100deg,#75f770,#b8ff7d);color:#092314;font:700 19px Oswald,sans-serif;padding:0 18px}.mf-submit:disabled{opacity:.6}',
'.mf-note{color:#9ebfb2;font-size:13px;line-height:1.45}.mf-error{color:#ffb6a9;font-size:14px;min-height:18px}',
'.mf-ticket{background:radial-gradient(ellipse at top right,#185842,#061710 73%);border:1px solid #4becab;border-radius:20px;padding:24px 18px;text-align:center;margin:18px 0;box-shadow:0 0 34px #37ffa51d}',
'.mf-ticket img{width:75px;height:75px;object-fit:contain;margin:0 auto 8px}.mf-ticket .mf-tbrand{font:700 30px Oswald,sans-serif}.mf-ticket .mf-status{font:600 18px Oswald,sans-serif;color:#a8ff79;margin:14px 0 7px}',
'.mf-ticket .mf-number{font:700 clamp(35px,10vw,54px) Oswald,sans-serif;color:#f2fff4;letter-spacing:.03em;margin:10px 0}.mf-ticket .mf-people{font:600 22px Oswald,sans-serif}.mf-ticket .mf-when{color:#c7e2cf;font-size:15px;margin-top:12px}',
'.mf-download{display:flex;gap:8px}.mf-download button{flex:1}.mf-download .mf-secondary{background:transparent;color:#d8ffe5;border:1px solid #68d5aa;border-radius:30px;padding:10px}',
'.mf-empty{min-height:240px;border:1px solid #185e49;border-radius:23px;padding:36px 22px;display:flex;align-items:center;justify-content:center;text-align:center;grid-column:1/-1;background:linear-gradient(145deg,#02130f,#0a2920)}',
'.mf-empty strong{font:700 26px Oswald,sans-serif}.mf-empty p{color:#afcec4;margin-top:8px;font-size:17px}',
'.mf-description{border:1px solid #286d52;border-radius:13px;background:#09271a;padding:12px;color:#cce9d7;line-height:1.4;white-space:pre-wrap;margin:3px 0 18px}',
'.event-list.mf-single-event{grid-template-columns:minmax(0,min(410px,100%))!important;justify-content:start}',
'/* Full square poster, with event title/date/time in a separate caption below it. */',
'.event-list>.event-card{position:relative!important;display:flex!important;flex-direction:column!important;gap:10px!important;align-items:stretch!important;justify-content:flex-start!important;min-width:0!important;width:100%!important;height:auto!important;max-height:none!important;aspect-ratio:auto!important;overflow:visible!important;border:0!important;border-radius:0!important;padding:0!important;background:transparent!important;box-shadow:none!important;text-align:center!important;transform:none!important;touch-action:manipulation!important}',
'.event-list>.event-card:after{content:none!important;display:none!important}',
'.event-list>.event-card .mf-poster-frame{position:relative;display:block;width:100%;height:auto;aspect-ratio:1/1;overflow:hidden;border:1px solid #6bae91;border-radius:clamp(14px,1.5vw,21px);background:#071b14;box-shadow:0 10px 25px #0009;transition:border-color .18s,box-shadow .18s}',
'.event-list>.event-card .mf-poster-frame>img{position:absolute!important;inset:0!important;display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;object-position:center!important;z-index:1!important;transform:none!important;transition:none!important}',
'.event-list>.event-card:hover,.event-list>.event-card.active,.event-list>.event-card:focus-visible{transform:none!important;box-shadow:none!important;outline:none}',
'.event-list>.event-card:hover .mf-poster-frame,.event-list>.event-card:focus-visible .mf-poster-frame{border-color:#b1ff8c;box-shadow:0 0 0 2px #8cffa677,0 14px 27px #000a}',
'.event-list>.event-card .mf-event-caption{display:grid;align-content:start;justify-items:center;gap:3px;width:100%;min-height:53px;padding:0 4px 4px;overflow-wrap:anywhere;pointer-events:none}',
'.event-list>.event-card .mf-event-caption-title{display:block;font:700 clamp(19px,1.9vw,28px)/1.13 Oswald,Arial,sans-serif;color:#f5fff8;letter-spacing:.005em;text-wrap:balance}',
'.event-list>.event-card .mf-event-caption-date{display:block;font:600 clamp(15px,1.25vw,19px)/1.25 Oswald,Arial,sans-serif;color:#a5ff79;letter-spacing:.025em}',
'.event-list>.event-card .mf-event-hint,.event-list>.event-card .event-info{display:none!important}',
'.event-list>.event-card .mf-no-poster-frame{background:radial-gradient(ellipse at 60% 15%,#275a44 0%,#09251b 48%,#03120e 100%)}',
'.mf-cover-placeholder{position:absolute;inset:0;display:grid;place-items:center;overflow:hidden}',
'.mf-cover-placeholder:before{content:"";width:69%;aspect-ratio:1/1;border-radius:50%;background:repeating-radial-gradient(circle,#132f29 0 4px,#244d3e 5px 6px,#081f19 7px 12px);border:2px solid #8fdfb055;box-shadow:0 18px 40px #000b,0 0 35px #7cff9d18}',
'.mf-cover-placeholder:after{content:"";position:absolute;width:15%;aspect-ratio:1/1;border-radius:50%;background:radial-gradient(circle,#071c14 0 15%,#9fe5ad 17% 75%,#327d57 77%);box-shadow:0 0 18px #7fffb466}',
'.mf-date-description{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;white-space:normal;line-height:1.3}',
'@media(max-width:760px){.event-wrap{height:auto!important}.event-list{height:auto!important;min-height:0!important}.event-list>.event-card{width:100%!important;max-width:100%!important;height:auto!important;aspect-ratio:auto!important;gap:9px!important}.event-list>.event-card .mf-poster-frame{aspect-ratio:1/1;border-radius:16px}.event-list>.event-card .mf-event-caption{min-height:57px}.event-list>.event-card .mf-event-caption-title{font-size:clamp(20px,5.4vw,27px)}.event-list>.event-card .mf-event-caption-date{font-size:clamp(14px,4vw,18px)}.event-wrap .nav-arrow{top:42%!important}}',
'.mf-calendar-caption{font:500 14px Oswald,sans-serif;color:#aad8c3;margin:-5px 0 14px;line-height:1.35}',
'.mf-calendar-nav{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:6px 0 12px}.mf-calendar-month{font:600 22px Oswald,sans-serif;text-transform:capitalize;text-align:center}.mf-calendar-arrow{width:39px;height:39px;border-radius:11px;background:#113e2d;color:#e8ffe4;border:1px solid #3f9b73;font-size:23px}.mf-calendar-arrow:disabled{opacity:.25;cursor:default}',
'.mf-calendar-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px}.mf-weekday{display:grid;place-items:center;color:#9fbaa9;font:500 12px Oswald,sans-serif;min-height:24px}.mf-calendar-empty{min-height:41px}.mf-calendar-day{height:42px;min-width:0;border:1px solid #1a4736;background:#071f16;border-radius:10px;color:#819b8c;font:600 16px Oswald,sans-serif;touch-action:manipulation}.mf-calendar-day:disabled{opacity:.42;cursor:default}.mf-calendar-day.available{color:#e7ffeb;border-color:#69ca8c;background:#14412c}.mf-calendar-day.available:after{content:"";display:block;width:4px;height:4px;border-radius:50%;background:#a5ff79;margin:-1px auto 0}.mf-calendar-day.available:hover{background:#236244}.mf-calendar-day.selected{color:#081c11;border-color:#b9ff7a;background:#b4fc7c;box-shadow:0 0 0 2px #b4fc7c33}.mf-calendar-day.selected:after{background:#185032}',
'.mf-date-selection{border-top:1px solid #32785b;margin-top:16px;padding-top:13px}.mf-date-label{font:600 15px Oswald,sans-serif;color:#a6e8c0;margin-bottom:10px}.mf-date-list{display:grid;gap:9px}.mf-date-option{width:100%;display:flex;align-items:center;gap:12px;text-align:left;border:1px solid #34785b;border-radius:13px;padding:9px;background:#0b2d20;color:#f5fff7;min-height:78px;touch-action:manipulation}.mf-date-option:hover,.mf-date-option:focus-visible{border-color:#b3ff79;background:#155239}.mf-date-poster{width:58px;height:68px;object-fit:cover;flex:none;border-radius:8px;background:radial-gradient(circle at top,#25785b,#06160e);border:1px solid #50966c}.mf-date-placeholder{display:grid;place-items:center;color:#baff8c;font:700 11px Oswald,sans-serif;letter-spacing:.06em;text-align:center}.mf-date-copy{display:grid;gap:4px;min-width:0;flex:1}.mf-date-title{font:600 19px/1.08 Oswald,sans-serif;overflow-wrap:anywhere}.mf-date-details{font:400 13px Roboto Condensed,Arial,sans-serif;color:#b9d6c4}.mf-date-demo{color:#ffc989}.mf-date-chevron{font:700 24px Oswald,sans-serif;color:#b4ff7a;margin-left:auto}',
'.mf-picker-back{border:0;background:transparent;color:#a7ffb6;font:600 14px Oswald,sans-serif;padding:0 0 8px;text-align:left;cursor:pointer;touch-action:manipulation}',
'/* Unclipped, circular carousel indicators with gentle state transitions. */',
'#dots.dots{box-sizing:border-box!important;position:relative!important;display:flex!important;justify-content:center!important;align-items:center!important;flex:0 0 auto!important;width:100%!important;max-width:100%!important;min-height:59px!important;margin:4px auto 0!important;padding:13px 12px 17px!important;gap:5px!important;overflow:visible!important;overflow-x:visible!important;overflow-y:visible!important;scrollbar-width:none!important;isolation:isolate!important}',
'#dots.dots>button{position:relative!important;box-sizing:border-box!important;display:grid!important;place-items:center!important;flex:0 0 33px!important;width:33px!important;min-width:33px!important;max-width:33px!important;height:33px!important;min-height:33px!important;max-height:33px!important;aspect-ratio:1/1!important;padding:0!important;margin:0!important;border:0!important;border-radius:50%!important;background:transparent!important;box-shadow:none!important;transform:none!important;overflow:visible!important;touch-action:manipulation!important;cursor:pointer}',
'#dots.dots>button:before{content:"";position:relative;z-index:2;display:block;width:11px;height:11px;min-width:11px;min-height:11px;aspect-ratio:1/1;border-radius:50%;background:#286d55;box-shadow:inset 0 1px 2px #092d24;transform:scale(1);transition:transform 440ms cubic-bezier(.2,.8,.2,1),background-color 380ms ease,box-shadow 380ms ease}',
'#dots.dots>button:after{content:"";position:absolute;z-index:1;inset:3px;border-radius:50%;background:radial-gradient(circle,#a7ff8eb0 0%,#99ff8748 33%,transparent 73%);filter:blur(4px);opacity:0;transform:scale(.62);transition:opacity 440ms ease,transform 540ms cubic-bezier(.2,.8,.2,1);pointer-events:none}',
'#dots.dots>button.current:before{background:#adff80;transform:scale(1.26);box-shadow:0 0 7px #9bff85,0 0 13px #91ff8880}',
'#dots.dots>button.current:after{opacity:1;transform:scale(1.35)}',
'#dots.dots>button:hover:not(.current):before{background:#55a880;transform:scale(1.1)}',
'#dots.dots>button:focus-visible{outline:2px solid #baff8c!important;outline-offset:-1px!important}',
'#eventList .mf-card-motion{display:flex;width:100%;min-width:0;flex-direction:column;gap:10px;will-change:transform,opacity;transform:translate3d(0,0,0);backface-visibility:hidden;-webkit-backface-visibility:hidden;transform-origin:center center}',
'#eventList.mf-sliding{pointer-events:none}',
'#eventList>.event-card{touch-action:pan-y!important}',
'@media(max-width:760px){#dots.dots{min-height:56px!important;padding:12px 6px 15px!important;gap:3px!important}#dots.dots>button{flex-basis:32px!important;width:32px!important;min-width:32px!important;max-width:32px!important;height:32px!important;min-height:32px!important;max-height:32px!important}#eventList .mf-card-motion{gap:9px}}',
'/* Desktop carousel: reserve side rails so arrows stay outside square posters. */',
'@media(min-width:761px){#events .event-wrap{--mf-arrow-track:clamp(49px,5.4vw,77px);box-sizing:border-box!important;width:calc(100% - 2 * var(--mf-arrow-track))!important;max-width:none!important;margin-inline:auto!important;overflow:visible!important}#events .event-wrap .nav-arrow{box-sizing:border-box!important;position:absolute!important;top:var(--mf-arrow-center-y,50%)!important;display:grid!important;place-items:center!important;flex:none!important;width:clamp(42px,3.65vw,52px)!important;min-width:42px!important;max-width:52px!important;height:clamp(42px,3.65vw,52px)!important;min-height:42px!important;max-height:52px!important;aspect-ratio:1/1!important;padding:0!important;line-height:0!important;font-size:0!important;border-radius:50%!important;transform:translateY(-50%)!important;z-index:6!important}#events .event-wrap .nav-arrow.prev{left:calc(-1 * var(--mf-arrow-track) + 4px)!important;right:auto!important}#events .event-wrap .nav-arrow.next{right:calc(-1 * var(--mf-arrow-track) + 4px)!important;left:auto!important}#events .event-wrap .nav-arrow:before{content:"";display:block;box-sizing:border-box;width:13px;height:13px;border-top:2.6px solid currentColor;border-right:2.6px solid currentColor;border-radius:1px;transform-origin:center center}#events .event-wrap .nav-arrow.prev:before{transform:translateX(2px) rotate(-135deg)}#events .event-wrap .nav-arrow.next:before{transform:translateX(-2px) rotate(45deg)}#events .event-wrap .nav-arrow[hidden]{display:none!important}}',
'/* Automatically center the entire carousel between the heading and the section bottom. */',
'#events .event-wrap,#events #dots{transform:translate3d(0,var(--mf-centering-offset,0px),0)!important;transition:transform 240ms cubic-bezier(.2,.7,.2,1)!important}',
'@media(prefers-reduced-motion:reduce){#events .event-wrap,#events #dots{transition:none!important}}',
'@media(prefers-reduced-motion:reduce){#dots.dots>button:before,#dots.dots>button:after{transition:none!important}#eventList .mf-card-motion{will-change:auto!important}}',
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
function eventDateKey(iso){
 var parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Minsk',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(iso));
 var obj={};parts.forEach(function(p){obj[p.type]=p.value;});
 return obj.year+'-'+obj.month+'-'+obj.day;
}
function calendarMonthLabel(month){
 var bits=month.split('-').map(Number);
 return new Date(Date.UTC(bits[0],bits[1]-1,1,12)).toLocaleDateString('ru-RU',{timeZone:'UTC',month:'long',year:'numeric'});
}
function shiftCalendarMonth(month,shift){
 var bits=month.split('-').map(Number),d=new Date(Date.UTC(bits[0],bits[1]-1+shift,1,12));
 return d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0');
}
async function openDatePicker(preferredDate){
 await refreshEvents();
 var grouped={};
 events.forEach(function(e){
  var key=eventDateKey(e.starts_at);
  if(!grouped[key])grouped[key]=[];
  grouped[key].push(e);
 });
 var dates=Object.keys(grouped).sort();
 if(!dates.length){
  dialogBody.replaceChildren();
  dialogBody.append(el('span','mf-tag','РАСПИСАНИЕ'));
  dialogBody.append(el('h2','mf-title','НЕТ ДОСТУПНЫХ ДАТ'));
  dialogBody.append(el('p','mf-meta','Пока нет мероприятий с открытой регистрацией. Загляните позже.'));
  open();return;
 }
 var selected=preferredDate&&grouped[preferredDate]?preferredDate:dates[0];
 var month=selected.slice(0,7);
 var firstMonth=dates[0].slice(0,7),lastMonth=dates[dates.length-1].slice(0,7);
 var shortDate=function(key){
  return new Date(key+'T12:00:00Z').toLocaleDateString('ru-RU',{timeZone:'UTC',weekday:'long',day:'numeric',month:'long',year:'numeric'});
 };
 function paint(){
  dialogBody.replaceChildren();
  dialogBody.append(el('span','mf-tag','МЕЛОФАНТЫ · РЕГИСТРАЦИЯ'));
  dialogBody.append(el('h2','mf-title','ВЫБЕРИТЕ ДАТУ'));
  dialogBody.append(el('p','mf-calendar-caption','Зелёные даты доступны для регистрации. Нажмите на дату, затем выберите мероприятие.'));
  var nav=el('div','mf-calendar-nav');
  var previous=el('button','mf-calendar-arrow','‹');previous.type='button';previous.disabled=month<=firstMonth;previous.setAttribute('aria-label','Предыдущий месяц');
  previous.addEventListener('click',function(){month=shiftCalendarMonth(month,-1);paint();});
  var title=el('div','mf-calendar-month',calendarMonthLabel(month));
  var next=el('button','mf-calendar-arrow','›');next.type='button';next.disabled=month>=lastMonth;next.setAttribute('aria-label','Следующий месяц');
  next.addEventListener('click',function(){month=shiftCalendarMonth(month,1);paint();});
  nav.append(previous,title,next);dialogBody.append(nav);
  var grid=el('div','mf-calendar-grid');
  ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'].forEach(function(v){grid.append(el('span','mf-weekday',v));});
  var ym=month.split('-').map(Number);
  var offset=(new Date(Date.UTC(ym[0],ym[1]-1,1)).getUTCDay()+6)%7;
  var total=new Date(Date.UTC(ym[0],ym[1],0)).getUTCDate();
  for(var blank=0;blank<offset;blank++)grid.append(el('span','mf-calendar-empty'));
  for(var day=1;day<=total;day++){
   var key=month+'-'+String(day).padStart(2,'0');
   var available=!!grouped[key];
   var dateButton=el('button','mf-calendar-day'+(available?' available':'')+(selected===key?' selected':''),String(day));
   dateButton.type='button';dateButton.disabled=!available;
   dateButton.setAttribute('aria-label',shortDate(key)+(available?', есть мероприятия':', мероприятий нет'));
   if(selected===key)dateButton.setAttribute('aria-pressed','true');
   if(available)(function(key){dateButton.addEventListener('click',function(){selected=key;paint();});})(key);
   grid.append(dateButton);
  }
  dialogBody.append(grid);
  var section=el('div','mf-date-selection');
  var selectedInMonth=selected.slice(0,7)===month;
  section.append(el('div','mf-date-label',selectedInMonth?shortDate(selected):'В этом месяце выберите отмеченную дату'));
  var cards=el('div','mf-date-list');
  if(selectedInMonth)(grouped[selected]||[]).forEach(function(e){
   var card=el('button','mf-date-option');card.type='button';
   if(e.poster){var poster=el('img','mf-date-poster');poster.src=e.poster;poster.alt='Афиша: '+e.title;card.append(poster);}
   else card.append(el('div','mf-date-poster mf-date-placeholder','МЕЛОФАНТЫ'));
   var copy=el('div','mf-date-copy');copy.append(el('span','mf-date-title',e.title));
   copy.append(el('span','mf-date-details',localDate(e.starts_at)+' · '+e.venue));
   if(e.description)copy.append(el('span','mf-date-details mf-date-description',e.description));
   if(e.is_demo)copy.append(el('span','mf-date-details mf-date-demo','ДЕМО · Тестовая регистрация'));
   card.append(copy,el('span','mf-date-chevron','›'));
   card.setAttribute('aria-label','Перейти к регистрации: '+e.title+', '+shortDate(selected));
   card.addEventListener('click',function(){eventForm(e,true);});
   cards.append(card);
  });
  section.append(cards);dialogBody.append(section);
 }
 paint();open();
}
function eventForm(e,fromDatePicker){
 active=e;receipt=null;dialogBody.replaceChildren();
 if(fromDatePicker){
  var back=el('button','mf-picker-back','← ДРУГАЯ ДАТА');back.type='button';
  back.addEventListener('click',function(){openDatePicker(eventDateKey(e.starts_at));});
  dialogBody.append(back);
 }
 dialogBody.append(el('span','mf-tag',e.is_demo?'ДЕМО · ТЕСТОВАЯ РЕГИСТРАЦИЯ':'СВОБОДНАЯ РЕГИСТРАЦИЯ'));
 dialogBody.append(el('h2','mf-title',e.title));
 dialogBody.append(el('p','mf-meta',localDate(e.starts_at)+' · '+e.venue));
 if(e.description)dialogBody.append(el('p','mf-description',e.description));
 var f=el('form','mf-form');
 f.innerHTML='<label class="mf-field">ВАШЕ ИМЯ<input name="name" autocomplete="name" maxlength="100" required minlength="2" placeholder="Как к вам обращаться?"></label><label class="mf-field">НОМЕР ТЕЛЕФОНА<input name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="40" required placeholder="+375 29 000 00 00"></label><label class="mf-field">КОЛИЧЕСТВО ЧЕЛОВЕК<input name="party_size" type="number" inputmode="numeric" min="1" max="50" step="1" value="1" required></label><label class="mf-field">КОММЕНТАРИЙ / ПОЖЕЛАНИЯ (НЕОБЯЗАТЕЛЬНО)<textarea name="guest_comment" maxlength="500" rows="3" placeholder="Например, место для компании или особые пожелания"></textarea></label><input name="website" style="display:none" tabindex="-1" autocomplete="off"><p class="mf-note">Данные используются организаторами для обработки регистрации на выбранное мероприятие. Личный кабинет не требуется.</p><div class="mf-error" role="alert"></div><button type="submit" class="mf-submit">ЗАРЕГИСТРИРОВАТЬСЯ →</button>';
 if(e.is_demo){var note=f.querySelector('.mf-note');if(note)note.textContent='Тестовая регистрация: используйте вымышленные данные. Заявка появится в админ-панели с пометкой ДЕМО и не является настоящим бронированием.';}
 dialogBody.append(f);open();
 f.addEventListener('submit',async function(ev){
  ev.preventDefault();var btn=f.querySelector('button[type=submit]'),err=f.querySelector('.mf-error');
  btn.disabled=true;btn.textContent='ОТПРАВЛЯЕМ…';err.textContent='';
  var p={event_id:e.id,name:f.elements.name.value,phone:f.elements.phone.value,party_size:Number(f.elements.party_size.value),guest_comment:f.elements.guest_comment.value,website:f.elements.website.value};
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
 dialogBody.append(el('span','mf-tag',d.is_demo?'ТЕСТОВАЯ ЗАЯВКА СОЗДАНА':'РЕГИСТРАЦИЯ УСПЕШНО ПРОЙДЕНА'));
 dialogBody.append(el('h2','mf-title','ВАШ НОМЕР РЕГИСТРАЦИИ'));
 var ticket=el('div','mf-ticket');
 var logo=document.querySelector('.brand-icon');if(logo){var copy=logo.cloneNode(true);copy.removeAttribute('class');ticket.append(copy);}
 ticket.append(el('div','mf-tbrand','МЕЛОФАНТЫ'));
 if(d.is_demo)ticket.append(el('div','mf-tag','ДЕМО · НЕ БИЛЕТ'));
 ticket.append(el('div','mf-status','✓ ВАША ЗАЯВКА ПРИНЯТА'));
 ticket.append(el('div','mf-number','ID '+d.code));
 ticket.append(el('div','mf-people',peopleText(d.party_size)));
 ticket.append(el('div','mf-when',d.title+' · '+localDate(d.starts_at)));
 dialogBody.append(ticket);
 dialogBody.append(el('p','mf-note',d.is_demo?'Это тестовая заявка, её можно проверить в админ-панели. Она не подтверждает участие в реальном мероприятии.':'Регистрация отправлена организатору и ожидает подтверждения. Сохраните номер ID, чтобы предъявить его при необходимости.'));
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
 c.fillStyle='#a2caba';c.font='28px Arial,sans-serif';c.fillText(d.is_demo?'ДЕМО · Не является билетом':'Сохраните эту карточку до мероприятия',500,1145);
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
 // Square poster above; title, date and time below. Clicking the entire card opens details.
 var button=el('button','event-card');button.type='button';
 button.setAttribute('aria-label','Открыть описание и регистрацию: '+e.title+' · '+localDate(e.starts_at));
 button.title='Открыть мероприятие: '+e.title;
 var frame=el('span','mf-poster-frame');
 if(e.poster){
  var img=el('img');img.src=e.poster;img.alt='';img.loading='lazy';img.decoding='async';frame.append(img);
 }else{
  frame.classList.add('mf-no-poster-frame');
  var cover=el('span','mf-cover-placeholder');cover.setAttribute('aria-hidden','true');frame.append(cover);
 }
 var caption=el('span','mf-event-caption');
 caption.append(el('span','mf-event-caption-title',e.title));
 var date=new Date(e.starts_at);
 var day=date.toLocaleDateString('ru-RU',{timeZone:'Europe/Minsk',day:'numeric',month:'long',year:'numeric'});
 var time=date.toLocaleTimeString('ru-RU',{timeZone:'Europe/Minsk',hour:'2-digit',minute:'2-digit'});
 caption.append(el('span','mf-event-caption-date',day+' · '+time));
 var motion=el('span','mf-card-motion');motion.append(frame,caption);button.append(motion);
 button.addEventListener('click',function(){eventForm(e);});return button;
}
var carouselBusy=false,refreshAfterSlide=false,dragOffset=0;
var carouselCenterOffset=0,carouselCenterFrame=0;
function centerUpcomingGames(){
 var section=document.getElementById('events');
 if(!section)return;
 var heading=section.querySelector('.section-bar');
 var poster=section.querySelector('#eventList .event-card .mf-poster-frame');
 var dot=section.querySelector('#dots>button.current')||section.querySelector('#dots>button');
 if(!heading||!poster||!dot){
  carouselCenterOffset=0;section.style.setProperty('--mf-centering-offset','0px');return;
 }
 // The parent section's bottom is the boundary before the next website block.
 var boundary=section.parentElement&&section.parentElement.classList.contains('discover')?section.parentElement:section;
 var wrap=section.querySelector('.event-wrap');
 if(wrap){
  var posterRect=poster.getBoundingClientRect(),wrapRect=wrap.getBoundingClientRect();
  wrap.style.setProperty('--mf-arrow-center-y',(posterRect.top+posterRect.height/2-wrapRect.top).toFixed(1)+'px');
 }
 var topGap=poster.getBoundingClientRect().top-heading.getBoundingClientRect().bottom;
 var bottomGap=boundary.getBoundingClientRect().bottom-dot.getBoundingClientRect().bottom;
 var next=carouselCenterOffset+(bottomGap-topGap)/2;
 // Keep arrows and pagination within the section, including small phone screens.
 next=Math.max(0,Math.min(72,next));
 if(Math.abs(next-carouselCenterOffset)<.5)return;
 carouselCenterOffset=next;
 section.style.setProperty('--mf-centering-offset',next.toFixed(1)+'px');
}
function scheduleUpcomingCentering(){
 if(carouselCenterFrame)cancelAnimationFrame(carouselCenterFrame);
 carouselCenterFrame=requestAnimationFrame(function(){carouselCenterFrame=0;centerUpcomingGames();});
}
function updateCarouselDots(dots){
 if(dots.children.length!==events.length){
  dots.replaceChildren();
  for(var i=0;i<events.length;i++){
   var dot=el('button');dot.type='button';
   dot.setAttribute('aria-label','Показать мероприятие '+(i+1));
   (function(n){dot.addEventListener('click',function(){
    if(carouselBusy||index===n)return;
    var forward=(n-index+events.length)%events.length;
    var backward=(index-n+events.length)%events.length;
    var direction=forward<=backward?1:-1;
    index=n;drawEvents(direction);
   });})(i);
   dots.append(dot);
  }
 }
 Array.from(dots.children).forEach(function(dot,i){
  var current=i===index;
  dot.classList.toggle('current',current);
  if(current)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current');
 });
}
function visibleCarouselEvents(){
 var amount=window.matchMedia('(max-width:760px)').matches?1:3;
 var visible=[];
 for(var i=0;i<Math.min(amount,events.length);i++)visible.push(events[(index+i)%events.length]);
 return visible;
}
function carouselImagesReady(cards){
 // Decode next posters before animating. Prevents an empty frame on mobile Chrome.
 return Promise.all(cards.map(function(card){
  var img=card.querySelector('.mf-poster-frame img');
  if(!img)return Promise.resolve();
  if(img.complete&&img.naturalWidth)return typeof img.decode==='function'?img.decode().catch(function(){}):Promise.resolve();
  return new Promise(function(resolve){
   var finished=false;
   function done(){if(finished)return;finished=true;clearTimeout(limit);resolve();}
   var limit=setTimeout(done,850);
   img.addEventListener('load',done,{once:true});
   img.addEventListener('error',done,{once:true});
   if(typeof img.decode==='function')img.decode().then(done,done);
  });
 }));
}
function drawEvents(direction){
 var list=document.getElementById('eventList'),dots=document.getElementById('dots');
 if(!list||!dots)return;
 if(carouselBusy){refreshAfterSlide=true;return;}
 if(!events.length){
  dots.replaceChildren();list.replaceChildren();
  var box=el('div','mf-empty'),inside=el('div');
  inside.append(el('strong','','СКОРО НОВЫЕ ИГРЫ'));
  inside.append(el('p','','Следите за анонсами. Регистрация откроется после публикации нового мероприятия.'));
  box.append(inside);list.append(box);
  document.getElementById('eventsPrev').hidden=true;
  document.getElementById('eventsNext').hidden=true;
  scheduleUpcomingCentering();return;
 }
 var previousButton=document.getElementById('eventsPrev'),nextButton=document.getElementById('eventsNext');
 previousButton.hidden=events.length<=1;nextButton.hidden=events.length<=1;
 var visible=visibleCarouselEvents(),incoming=visible.map(buildCard);
 list.classList.toggle('mf-single-event',incoming.length===1);
 list.style.gridTemplateColumns='repeat('+incoming.length+',minmax(0,1fr))';
 var outgoing=Array.from(list.children).filter(function(card){return card.classList.contains('event-card');});
 var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!direction||reduced||!outgoing.length||outgoing.length!==incoming.length||typeof outgoing[0].animate!=='function'){
  list.replaceChildren.apply(list,incoming);
  updateCarouselDots(dots);
  dragOffset=0;scheduleUpcomingCentering();return;
 }
 carouselBusy=true;
 // Keep the old poster visible until the next image is ready to display.
 carouselImagesReady(incoming).then(function(){
  if(!list.isConnected){carouselBusy=false;return;}
  var directionSign=direction>0?-1:1;
  var duration=760,ease='cubic-bezier(.22,.61,.36,1)';
  var animations=[];
  list.classList.add('mf-sliding');
  updateCarouselDots(dots);
  // Preserve the current list height while cards overlap in the same grid row.
  var oldHeight=list.getBoundingClientRect().height;
  list.style.minHeight=Math.ceil(oldHeight)+'px';
  outgoing.forEach(function(card,i){
   card.style.gridColumn=String(i+1);
   card.style.gridRow='1';
   card.style.zIndex='1';
   var motion=card.querySelector('.mf-card-motion');
   if(!motion)return;
   var shift=Math.max(76,Math.min(168,card.getBoundingClientRect().width*.38));
   animations.push(motion.animate([
    {offset:0,opacity:1,transform:'translate3d('+dragOffset+'px,0,0) scale(1)'},
    {offset:.32,opacity:.97,transform:'translate3d('+(directionSign*shift*.28)+'px,0,0) scale(.996)'},
    {offset:.8,opacity:.13,transform:'translate3d('+(directionSign*shift*.93)+'px,0,0) scale(.983)'},
    {offset:1,opacity:0,transform:'translate3d('+(directionSign*shift)+'px,0,0) scale(.983)'}
   ],{duration:duration,easing:ease,fill:'both'}));
  });
  incoming.forEach(function(card,i){
   card.style.gridColumn=String(i+1);
   card.style.gridRow='1';
   card.style.zIndex='2';
   card.style.pointerEvents='none';
   list.append(card);
   var motion=card.querySelector('.mf-card-motion');
   if(!motion)return;
   var shift=Math.max(76,Math.min(168,card.getBoundingClientRect().width*.38));
   animations.push(motion.animate([
    {offset:0,opacity:0,transform:'translate3d('+(-directionSign*shift)+'px,0,0) scale(.983)'},
    {offset:.22,opacity:.15,transform:'translate3d('+(-directionSign*shift*.77)+'px,0,0) scale(.987)'},
    {offset:.72,opacity:.97,transform:'translate3d('+(-directionSign*shift*.18)+'px,0,0) scale(.997)'},
    {offset:1,opacity:1,transform:'translate3d(0,0,0) scale(1)'}
   ],{duration:duration,easing:ease,fill:'both'}));
  });
  dragOffset=0;
  Promise.all(animations.map(function(animation){return animation.finished.catch(function(){});})).then(function(){
   if(!list.isConnected){animations.forEach(function(animation){animation.cancel();});carouselBusy=false;return;}
   // Remove completed animations before the next swipe to avoid retained transforms.
   incoming.forEach(function(card){
    var motion=card.querySelector('.mf-card-motion');
    if(motion){motion.style.transform='translate3d(0,0,0)';motion.style.opacity='1';}
   });
   animations.forEach(function(animation){animation.cancel();});
   incoming.forEach(function(card){
    var motion=card.querySelector('.mf-card-motion');
    if(motion){motion.style.transform='';motion.style.opacity='';}
    card.style.gridColumn='';card.style.gridRow='';
    card.style.zIndex='';card.style.pointerEvents='';
   });
   list.replaceChildren.apply(list,incoming);
   list.style.minHeight='';
   list.classList.remove('mf-sliding');
   carouselBusy=false;
   scheduleUpcomingCentering();
   if(refreshAfterSlide){refreshAfterSlide=false;drawEvents();}
  });
 }).catch(function(){
  carouselBusy=false;
  list.classList.remove('mf-sliding');
  list.style.minHeight='';
  list.replaceChildren.apply(list,incoming);
  updateCarouselDots(dots);
  scheduleUpcomingCentering();
 });
}
function move(n){
 if(!events.length||carouselBusy)return;
 index=(index+n+events.length)%events.length;
 drawEvents(n);
}
['eventsPrev','eventsNext'].forEach(function(id){
 var node=document.getElementById(id);
 if(node)node.addEventListener('click',function(e){
  e.stopImmediatePropagation();
  move(id==='eventsPrev'?-1:1);
 },true);
});
var selectedEventId=new URLSearchParams(location.search).get('event');
var directEventOpened=false;
function openDirectEvent(){
 if(!selectedEventId||directEventOpened)return;
 var selected=events.find(function(e){return e.id===selectedEventId;});
 if(selected){directEventOpened=true;eventForm(selected);}
}
var swipeStart=null,ignoreTapUntil=0,eventRail=document.getElementById('eventList');
function resetSwipeTransform(){
 if(!eventRail)return;
 var distance=dragOffset,reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 eventRail.querySelectorAll('.mf-card-motion').forEach(function(motion){
  motion.style.transform='';
  motion.style.opacity='';
  if(!distance||reduced||typeof motion.animate!=='function')return;
  motion.animate([
   {transform:'translate3d('+distance+'px,0,0)'},
   {transform:'translate3d(0,0,0)'}
  ],{duration:440,easing:'cubic-bezier(.22,.78,.24,1)'}).finished.catch(function(){});
 });
 dragOffset=0;
}
if(eventRail){
 eventRail.addEventListener('touchstart',function(e){
  if(carouselBusy||e.touches.length!==1){swipeStart=null;return;}
  swipeStart={x:e.touches[0].clientX,y:e.touches[0].clientY};
  dragOffset=0;
 },{passive:true});
 eventRail.addEventListener('touchmove',function(e){
  if(!swipeStart||carouselBusy||e.touches.length!==1)return;
  var dx=e.touches[0].clientX-swipeStart.x,dy=e.touches[0].clientY-swipeStart.y;
  if(Math.abs(dx)<=10||Math.abs(dx)<Math.abs(dy)*1.3)return;
  dragOffset=Math.max(-62,Math.min(62,dx*.32));
  eventRail.querySelectorAll('.mf-card-motion').forEach(function(motion){
   motion.style.transform='translate3d('+dragOffset+'px,0,0)';
  });
 },{passive:true});
 eventRail.addEventListener('touchend',function(e){
  if(!swipeStart||!e.changedTouches.length)return;
  var dx=e.changedTouches[0].clientX-swipeStart.x,dy=e.changedTouches[0].clientY-swipeStart.y;
  swipeStart=null;
  if(!carouselBusy&&Math.abs(dx)>38&&Math.abs(dx)>Math.abs(dy)*1.35){
   ignoreTapUntil=Date.now()+500;
   move(dx<0?1:-1);
  }else resetSwipeTransform();
 },{passive:true});
 eventRail.addEventListener('touchcancel',function(){swipeStart=null;resetSwipeTransform();},{passive:true});
 eventRail.addEventListener('click',function(e){
  if(Date.now()<ignoreTapUntil){e.preventDefault();e.stopImmediatePropagation();}
 },true);
 eventRail.addEventListener('keydown',function(e){
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}
 });
}
window.addEventListener('resize',function(){
 if(events.length)drawEvents();
 scheduleUpcomingCentering();
});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(scheduleUpcomingCentering);
function openFirst(){openDatePicker();}
document.querySelectorAll('a.main-btn').forEach(function(a){
 if(/РЕГИСТРАЦИЯ|ЗАРЕГИСТРИРОВАТЬСЯ/i.test(a.textContent||'')){a.removeAttribute('target');a.setAttribute('href','#events');a.addEventListener('click',function(ev){ev.preventDefault();ev.stopImmediatePropagation();openFirst();},true);}
});
var all=document.getElementById('allEvents');
if(all&&all.tagName==='BUTTON')all.addEventListener('click',function(){location.href='/events';});
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
   if(all)all.textContent='ВСЕ МЕРОПРИЯТИЯ ('+events.length+') →';
   openDirectEvent();
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
window.addEventListener('storage',function(e){if(e.key==='melofanty-events-updated')refreshEvents();});
setInterval(function(){if(!document.hidden)refreshEvents();},15000);
})();