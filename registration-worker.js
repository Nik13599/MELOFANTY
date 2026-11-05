/* MELOFANTY registration API. Deployed together with the existing homepage and game. */
const REG_DB = 'DB';
function regJson(data, status) {
  return new Response(JSON.stringify(data), {status:status||200, headers:{
    'content-type':'application/json; charset=utf-8','cache-control':'no-store',
    'x-content-type-options':'nosniff'
  }});
}
function regError(message,status){return regJson({error:message},status||400);}
async function regBody(req){
  if((req.headers.get('content-type')||'').split(';')[0].trim()!=='application/json') throw new Error('Требуется JSON');
  const len=Number(req.headers.get('content-length')||0);
  if(len>800000)throw new Error('Слишком большой запрос');
  const text=await req.text();
  if(text.length>800000)throw new Error('Слишком большой запрос');
  const obj=JSON.parse(text);if(!obj||typeof obj!=='object'||Array.isArray(obj))throw new Error('Некорректные данные');return obj;
}
function regText(v,max){return String(v===undefined?'':v).trim().slice(0,max);}
function regPeople(v){const n=Number(v);return Number.isInteger(n)&&n>=1&&n<=50?n:0;}
function regPhone(v){const s=regText(v,40);return /^[+0-9 ()-]{8,40}$/.test(s)&&s.replace(/\D/g,'').length>=8?s:null;}
function regPoster(v){const s=regText(v,300010);if(!s)return '';if(s.length>300000||!/^data:image\/webp;base64,[a-zA-Z0-9+/=]+$/.test(s))throw new Error('Сохранить можно только WebP до 220 КБ. Обновите админку: встроенный конвертер подготовит изображение автоматически.');return s;}
function regDate(v){const s=String(v||'');const d=new Date(s);if(!Number.isFinite(d.getTime()))throw new Error('Укажите корректную дату и время');return d.toISOString();}
function regDayMonth(iso){
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Minsk',day:'2-digit',month:'2-digit'}).formatToParts(new Date(iso));
 return parts.find(p=>p.type==='day').value+parts.find(p=>p.type==='month').value;
}
function regIdFor(e,n){return regDayMonth(e.starts_at)+'-'+n;}
function regSameDay(a,b){return regDayMonth(a)===regDayMonth(b);}
function regActive(e){return !!e&&!e.archived&&new Date(e.ends_at).getTime()>Date.now();}
function regEventPublic(e){
 return {id:e.id,title:e.title,starts_at:e.starts_at,ends_at:e.ends_at,venue:e.venue,description:e.description,poster:e.poster||'',capacity:e.capacity,is_demo:!!e.is_demo,registered_guests:e.registered_guests||0};
}
// A small fingerprint prevents downloading every embedded poster on each polling tick.
function regPublicVersion(items){
 return JSON.stringify(items.map(e=>[e.id,e.updated_at||'',e.starts_at,e.ends_at,Number(e.next_seq)||0]));
}
async function regPublicVersionEndpoint(env){
 const rows=(await env.DB.prepare("SELECT id,updated_at,starts_at,ends_at,next_seq FROM events WHERE archived=0 AND ends_at>? ORDER BY starts_at ASC").bind(new Date().toISOString()).all()).results||[];
 return regJson({version:regPublicVersion(rows)});
}
async function regHmac(value,secret){
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const sign=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value));
 return Array.from(new Uint8Array(sign),x=>x.toString(16).padStart(2,'0')).join('');
}
function regEqual(a,b){if(a.length!==b.length)return false;let v=0;for(let i=0;i<a.length;i++)v|=a.charCodeAt(i)^b.charCodeAt(i);return v===0;}
function regCookie(request){
 const cookies=request.headers.get('cookie')||'';return (cookies.match(/(?:^|;\s*)melofanty_admin=([^;]+)/)||[])[1]||'';
}
async function regAuthorized(request,env){
 const raw=regCookie(request),point=raw.lastIndexOf('.');
 if(point<1||!env.ADMIN_SESSION_SECRET)return false;
 const payload=raw.slice(0,point),sig=raw.slice(point+1);
 const parts=payload.split('_'),ts=Number(parts[0]);
 if(!Number.isFinite(ts)||ts>Date.now()+60000||Date.now()-ts>43200000||parts.length!==2)return false;
 return regEqual(sig,await regHmac(payload,env.ADMIN_SESSION_SECRET));
}
function regOriginOk(req){
 const origin=req.headers.get('origin');
 return !!origin&&origin===new URL(req.url).origin;
}
async function regLogin(req,env){
 const b=await regBody(req);
 const ip=req.headers.get('cf-connecting-ip')||'unknown';
 const ipHash=await regHmac(ip,env.ADMIN_SESSION_SECRET);
 const now=Math.floor(Date.now()/1000);
 const tries=await env.DB.prepare('SELECT COUNT(*) AS n FROM admin_attempts WHERE ip_hash=? AND at>?').bind(ipHash,now-900).first();
 if(tries&&tries.n>=8)return regError('Слишком много попыток. Повторите позже.',429);
 const supplied=await regHmac(String(b.password||''),env.ADMIN_SESSION_SECRET);
 const expected=await regHmac(env.ADMIN_PASSWORD||'',env.ADMIN_SESSION_SECRET);
 if(!env.ADMIN_PASSWORD||!regEqual(supplied,expected)){
   await env.DB.prepare('INSERT INTO admin_attempts(ip_hash,at) VALUES(?,?)').bind(ipHash,now).run();
   return regError('Неверный пароль',401);
 }
 await env.DB.prepare('DELETE FROM admin_attempts WHERE ip_hash=?').bind(ipHash).run();
 const bytes=new Uint8Array(18);crypto.getRandomValues(bytes);
 const payload=Date.now()+'_'+Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');
 const value=payload+'.'+await regHmac(payload,env.ADMIN_SESSION_SECRET);
 const response=regJson({ok:true});
 response.headers.set('Set-Cookie','melofanty_admin='+value+'; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200');
 return response;
}
// Public registration protection. Reuses the indexed attempt table with a separate
// HMAC namespace, so admin login attempts and guest registrations never mix.
async function regPublicRateLimit(req,env){
 const ip=req.headers.get('cf-connecting-ip')||'unknown';
 const hashed=await regHmac('guest-registration:'+ip,env.ADMIN_SESSION_SECRET);
 const now=Math.floor(Date.now()/1000);
 const count=await env.DB.prepare(
  'SELECT COUNT(*) total, COALESCE(SUM(CASE WHEN at>? THEN 1 ELSE 0 END),0) rapid FROM admin_attempts WHERE ip_hash=? AND at>?'
 ).bind(now-60,hashed,now-900).first();
 if(count&&(Number(count.rapid)>=25||Number(count.total)>=100)){
  const response=regError('Слишком много заявок с одного подключения. Повторите регистрацию позже.',429);
  response.headers.set('Retry-After','60');
  return response;
 }
 await env.DB.prepare('INSERT INTO admin_attempts(ip_hash,at) VALUES(?,?)').bind(hashed,now).run();
 // Expire old hashed IP attempts so this shared table cannot grow forever.
 if(Math.random()<.025){
  try{await env.DB.prepare('DELETE FROM admin_attempts WHERE at<?').bind(now-86400).run();}
  catch(e){console.warn('MELOFANTY: attempt cleanup skipped');}
 }
 return null;
}
async function regInsert(env,event,person,manual){
 const name=regText(person.name,100),phone=regPhone(person.phone),party=regPeople(person.party_size);
 const guestComment=regText(person.guest_comment,500),adminComment=manual?regText(person.admin_comment,1000):'';
 if(name.length<2||!phone||!party)return regError('Проверьте имя, телефон и количество человек',400);
 if(!regActive(event))return regError('Регистрация на это мероприятие закрыта',409);
 const now=new Date().toISOString();
 // D1 batch is a single transaction: the new ID is committed together
 // with its registration, never alone. This also saves a database round trip.
 const prefix=regDayMonth(event.starts_at);
 const status=manual?'confirmed':'pending';
 const source=event.is_demo?'demo':manual?'admin':'site';
 const results=await env.DB.batch([
  env.DB.prepare(
   "UPDATE events SET next_seq=next_seq+1 WHERE id=? AND archived=0 AND ends_at>? AND starts_at=? AND (capacity IS NULL OR (SELECT COALESCE(SUM(party_size),0) FROM registrations WHERE event_id=? AND status IN ('pending','confirmed'))+?<=capacity) RETURNING next_seq,starts_at"
  ).bind(event.id,now,event.starts_at,event.id,party),
  env.DB.prepare(
   "INSERT INTO registrations(event_id,seq,code,name,phone,party_size,status,source,guest_comment,admin_comment) SELECT id,next_seq,?||'-'||next_seq,?,?,?,?,?,?,? FROM events WHERE id=? AND changes()=1"
  ).bind(prefix,name,phone,party,status,source,guestComment,adminComment,event.id)
 ]);
 const next=results[0]&&results[0].results&&results[0].results[0];
 if(!next)return regError('Регистрация закрыта или свободных мест недостаточно',409);
 if(!results[1]||!results[1].meta||results[1].meta.changes!==1){
  console.error('MELOFANTY: registration batch insert did not create a row',event.id);
  return regError('Не удалось сохранить заявку. Проверьте регистрацию у организатора.',500);
 }
 const code=regIdFor(next,next.next_seq);
 return regJson({ok:true,id:code,code,event_id:event.id,title:event.title,starts_at:event.starts_at,venue:event.venue,party_size:party,is_demo:!!event.is_demo,status},201);
}
// Compact versions for admin polling; no poster image bytes are transferred.
function regAdminEventVersion(items){
 return JSON.stringify(items.map(e=>[e.id,e.updated_at||'',e.starts_at,e.ends_at,Number(e.archived)||0,Number(e.next_seq)||0,Number(e.registered_guests)||0,Number(e.applications)||0,Number(e.demo_applications)||0]));
}
function regAdminDetailVersion(event,registrations){
 return JSON.stringify([event.updated_at||'',Number(event.next_seq)||0,event.archived||0,registrations.map(r=>[r.seq,r.updated_at||'',r.status,r.party_size])]);
}
async function regAdminEventsVersion(env,archive){
 const sql="SELECT e.id,e.updated_at,e.starts_at,e.ends_at,e.archived,e.next_seq,(SELECT COALESCE(SUM(r.party_size),0) FROM registrations r WHERE r.event_id=e.id AND r.status IN ('pending','confirmed')) registered_guests,(SELECT COUNT(*) FROM registrations r WHERE r.event_id=e.id AND r.status!='deleted') applications,(SELECT COUNT(*) FROM registrations r WHERE r.event_id=e.id AND r.source='demo' AND r.status!='deleted') demo_applications FROM events e ORDER BY e.starts_at ASC";
 const items=(await env.DB.prepare(sql).all()).results||[];
 const now=Date.now();
 const filtered=items.filter(e=>{
  const passed=e.archived||new Date(e.ends_at).getTime()<=now;
  return archive?passed:!passed;
 });
 return regJson({version:regAdminEventVersion(archive?filtered.reverse():filtered)});
}
async function regAdminDetailVersionEndpoint(env,id){
 const event=await env.DB.prepare('SELECT id,updated_at,next_seq,archived FROM events WHERE id=?').bind(id).first();
 if(!event)return regError('Мероприятие не найдено',404);
 const registrations=(await env.DB.prepare("SELECT seq,updated_at,status,party_size FROM registrations WHERE event_id=? AND status!='deleted' ORDER BY seq DESC").bind(id).all()).results||[];
 return regJson({version:regAdminDetailVersion(event,registrations)});
}
async function regEvents(env,admin,archive){
 const sql="SELECT e.*, (SELECT COALESCE(SUM(r.party_size),0) FROM registrations r WHERE r.event_id=e.id AND r.status IN ('pending','confirmed')) registered_guests, (SELECT COUNT(*) FROM registrations r WHERE r.event_id=e.id AND r.status!='deleted') applications, (SELECT COUNT(*) FROM registrations r WHERE r.event_id=e.id AND r.source='demo' AND r.status!='deleted') demo_applications FROM events e ORDER BY e.starts_at DESC";
 const items=(await env.DB.prepare(sql).all()).results||[];
 const now=Date.now();
 const filtered=items.filter(e=>{
   const passed=e.archived||new Date(e.ends_at).getTime()<=now;
   return admin ? (archive?passed:!passed) : !passed;
 });
 const ordered=filtered.slice().sort((a,b)=>new Date(a.starts_at).getTime()-new Date(b.starts_at).getTime());
 if(!admin)return regJson({events:ordered.map(regEventPublic),version:regPublicVersion(ordered)});
 const visible=archive?ordered.reverse():ordered;
 return regJson({events:visible,archive:!!archive,version:regAdminEventVersion(visible)});
}
async function regPublicDirectory(env){
 // Never expose archived or already finished events on the public events directory.
 const sql="SELECT e.*, (SELECT COALESCE(SUM(r.party_size),0) FROM registrations r WHERE r.event_id=e.id AND r.status IN ('pending','confirmed')) registered_guests FROM events e WHERE e.archived=0 AND e.ends_at>? ORDER BY e.starts_at ASC";
 const rows=(await env.DB.prepare(sql).bind(new Date().toISOString()).all()).results||[];
 return regJson({events:rows.map(regEventPublic),version:regPublicVersion(rows)});
}
async function regEventDetails(env,id){
 const e=await env.DB.prepare('SELECT * FROM events WHERE id=?').bind(id).first();
 if(!e)return regError('Мероприятие не найдено',404);
 const registrations=(await env.DB.prepare(
   "SELECT seq,code,name,phone,party_size,status,source,guest_comment,admin_comment,created_at,updated_at FROM registrations WHERE event_id=? AND status!='deleted' ORDER BY seq DESC"
 ).bind(id).all()).results||[];
 const stats=(await env.DB.prepare(
   "SELECT COUNT(CASE WHEN status!='deleted' THEN 1 END) total_apps, COALESCE(SUM(CASE WHEN status IN ('pending','confirmed') THEN party_size ELSE 0 END),0) guests, COUNT(CASE WHEN status='cancelled' THEN 1 END) cancelled_apps, COALESCE(SUM(CASE WHEN status='cancelled' THEN party_size ELSE 0 END),0) cancelled_guests, COUNT(CASE WHEN status='pending' THEN 1 END) pending_apps, COUNT(CASE WHEN status='confirmed' THEN 1 END) confirmed_apps, COUNT(CASE WHEN source='demo' AND status!='deleted' THEN 1 END) demo_apps FROM registrations WHERE event_id=?"
 ).bind(id).first())||{};
 return regJson({event:e,registrations,stats,version:regAdminDetailVersion(e,registrations)});
}
async function regSaveEvent(env,b,id){
 const title=regText(b.title,120),venue=regText(b.venue,160),description=regText(b.description,1800);
 if(title.length<2)throw new Error('Укажите название мероприятия');
 const starts=regDate(b.starts_at),ends=regDate(b.ends_at);
 if(ends<=starts)throw new Error('Окончание должно быть позже начала');
 const capacity=b.capacity===''||b.capacity==null?null:Number(b.capacity);
 if(capacity!==null&&(!Number.isInteger(capacity)||capacity<1||capacity>100000))throw new Error('Некорректная вместимость');
 const poster=regPoster(b.poster||'');
 const adminPoster=regPoster(b.admin_poster||'');
  const isDemo=b.is_demo?1:0;
 if(id){
  const old=await env.DB.prepare('SELECT * FROM events WHERE id=?').bind(id).first();
  if(!old)return regError('Мероприятие не найдено',404);
  if(old.next_seq>0&&!regSameDay(old.starts_at,starts))throw new Error('После появления заявок нельзя изменять день и месяц мероприятия: изменятся ID');
   if(old.next_seq>0&&Number(old.is_demo||0)!==isDemo)throw new Error('Нельзя менять тестовый статус мероприятия после появления заявок');
  await env.DB.prepare("UPDATE events SET title=?,starts_at=?,ends_at=?,venue=?,description=?,poster=?,admin_poster=?,capacity=?,is_demo=?,archived=?,updated_at=? WHERE id=?")
   .bind(title,starts,ends,venue,description,poster,adminPoster,capacity,isDemo,b.archived?1:0,new Date().toISOString(),id).run();
  return regJson({ok:true,id});
 }
 const newId=crypto.randomUUID();
 await env.DB.prepare('INSERT INTO events(id,title,starts_at,ends_at,venue,description,poster,admin_poster,capacity,is_demo) VALUES(?,?,?,?,?,?,?,?,?,?)')
  .bind(newId,title,starts,ends,venue,description,poster,adminPoster,capacity,isDemo).run();
 return regJson({ok:true,id:newId},201);
}
async function regManageRegistration(env,b){
 const eventId=regText(b.event_id,80),seq=Number(b.seq);
 if(!eventId||!Number.isInteger(seq)||seq<1)return regError('Заявка не найдена',404);
 const existing=await env.DB.prepare('SELECT * FROM registrations WHERE event_id=? AND seq=?').bind(eventId,seq).first();
 if(!existing||existing.status==='deleted')return regError('Заявка не найдена',404);
 const nextStatus=regText(b.status||existing.status,20);
 if(!['pending','confirmed','cancelled','deleted'].includes(nextStatus))throw new Error('Некорректный статус');
 const name=b.name===undefined?existing.name:regText(b.name,100);
 const phone=b.phone===undefined?existing.phone:regPhone(b.phone);
 const party=b.party_size===undefined?existing.party_size:regPeople(b.party_size);
 const guestComment=b.guest_comment===undefined?existing.guest_comment:regText(b.guest_comment,500);
 const adminComment=b.admin_comment===undefined?existing.admin_comment:regText(b.admin_comment,1000);
 if(name.length<2||!phone||!party)throw new Error('Проверьте имя, телефон и количество гостей');
 const event=await env.DB.prepare('SELECT capacity FROM events WHERE id=?').bind(eventId).first();
 if(event&&event.capacity!==null&&['pending','confirmed'].includes(nextStatus)){
  const booked=await env.DB.prepare("SELECT COALESCE(SUM(party_size),0) n FROM registrations WHERE event_id=? AND status IN ('pending','confirmed') AND seq!=?").bind(eventId,seq).first();
  if(booked.n+party>event.capacity)throw new Error('Превышена вместимость мероприятия');
 }
 // Capacity is checked again INSIDE the write statement, so two concurrent
 // admin confirmations cannot both overbook the last available place.
 const activeUpdate=nextStatus==='pending'||nextStatus==='confirmed';
 const sql="UPDATE registrations SET name=?,phone=?,party_size=?,status=?,guest_comment=?,admin_comment=?,updated_at=? WHERE event_id=? AND seq=?"+
  (activeUpdate?" AND EXISTS(SELECT 1 FROM events e WHERE e.id=? AND (e.capacity IS NULL OR (SELECT COALESCE(SUM(r.party_size),0) FROM registrations r WHERE r.event_id=e.id AND r.status IN ('pending','confirmed') AND r.seq!=?)+?<=e.capacity))":"");
 const bind=[name,phone,party,nextStatus,guestComment,adminComment,new Date().toISOString(),eventId,seq];
 if(activeUpdate)bind.push(eventId,seq,party);
 const changed=await env.DB.prepare(sql).bind(...bind).run();
 if(changed.meta&&changed.meta.changes===0)return regError('Мест недостаточно или заявка была изменена другим администратором. Обновите список.',409);
 return regJson({ok:true});
}
async function registrationRouter(req,env){
 const url=new URL(req.url),path=url.pathname,method=req.method;
 try{
  if(method==='GET'&&(path==='/'||path==='/index.html')){
    return new Response(home.replace('</body>','<script>'+registrationGuestJs+'</script></body>'),
      {headers:{'content-type':'text/html; charset=utf-8','cache-control':'public, max-age=60','x-content-type-options':'nosniff'}});
  }
  if(method==='GET'&&(path==='/events'||path==='/events/'||path==='/events.html'))return new Response(eventDirectoryPage,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'public, max-age=60','x-content-type-options':'nosniff'}});
  if(method==='GET'&&path==='/melofanty_screen_game.html')
   return new Response(game,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'public, max-age=60'}});
  if(method==='GET'&&(path==='/registration-admin'||path==='/registration-admin/'))
   return new Response(registrationAdminPage,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','x-frame-options':'DENY'}});
  if(path==='/api/registration/events/version'&&method==='GET')return regPublicVersionEndpoint(env);
  if(path==='/api/registration/events'&&method==='GET')return regEvents(env,false,false);
  if(path==='/api/registration/events/all'&&method==='GET')return regPublicDirectory(env);
  if(path==='/api/registration/register'&&method==='POST'){
    if(!regOriginOk(req))return regError('Недопустимый источник запроса',403);
    const b=await regBody(req);
    if(b.website)return regError('Недопустимые данные',400);
    const blocked=await regPublicRateLimit(req,env);
    if(blocked)return blocked;
    const e=await env.DB.prepare('SELECT * FROM events WHERE id=?').bind(regText(b.event_id,80)).first();
    return regInsert(env,e,b,false);
  }
  if(!path.startsWith('/api/registration/admin/'))return new Response('Not Found',{status:404});
  if(method!=='GET'&&!regOriginOk(req))return regError('Недопустимый источник запроса',403);
  if(path==='/api/registration/admin/login'&&method==='POST')return regLogin(req,env);
  if(!await regAuthorized(req,env))return regError('Требуется вход администратора',401);
  if(path==='/api/registration/admin/session'&&method==='GET')return regJson({ok:true});
  if(path==='/api/registration/admin/logout'&&method==='POST'){
    const response=regJson({ok:true});response.headers.set('Set-Cookie','melofanty_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');return response;
  }
  if(path==='/api/registration/admin/events/version'&&method==='GET')return regAdminEventsVersion(env,url.searchParams.get('archive')==='1');
  if(path==='/api/registration/admin/events'&&method==='GET')return regEvents(env,true,url.searchParams.get('archive')==='1');
  if(path==='/api/registration/admin/events'&&method==='POST')return regSaveEvent(env,await regBody(req),null);
  const detailVersionPath=path.match(/^\/api\/registration\/admin\/events\/([a-z0-9-]+)\/version$/i);
  if(detailVersionPath&&method==='GET')return regAdminDetailVersionEndpoint(env,detailVersionPath[1]);
  const eventPath=path.match(/^\/api\/registration\/admin\/events\/([a-z0-9-]+)$/i);
  if(eventPath){
   if(method==='GET')return regEventDetails(env,eventPath[1]);
   if(method==='PATCH')return regSaveEvent(env,await regBody(req),eventPath[1]);
  }
  const manual=path.match(/^\/api\/registration\/admin\/events\/([a-z0-9-]+)\/manual$/i);
  if(manual&&method==='POST'){
   const event=await env.DB.prepare('SELECT * FROM events WHERE id=?').bind(manual[1]).first();
   return regInsert(env,event,await regBody(req),true);
  }
  if(path==='/api/registration/admin/registration'&&method==='PATCH')return regManageRegistration(env,await regBody(req));
  return regError('Метод не поддерживается',404);
 }catch(err){
  console.error('MELOFANTY registration',err);
  if(err instanceof SyntaxError)return regError('Некорректный JSON',400);
  const msg=String(err&&err.message||'Внутренняя ошибка');
  if(/D1_|SQLITE_|database/i.test(msg))return regError('Ошибка базы данных. Попробуйте ещё раз.',500);
  return regError(msg,400);
 }
}
export default {fetch:registrationRouter};
