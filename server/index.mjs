import http from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {scryptSync,randomBytes,timingSafeEqual,createHash,randomUUID} from 'node:crypto';
import {mkdirSync,readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateScene} from './schema.mjs';
import {generate} from './model.mjs';
export function start({path=process.env.DATABASE_PATH||'.local/beescene.sqlite',port=Number(process.env.API_PORT||5180),host='127.0.0.1',adminPassword=process.env.ADMIN_PASSWORD,secure=process.env.COOKIE_SECURE==='true',generator=generate}={}){
 mkdirSync(dirname(resolve(path)),{recursive:true,mode:0o700});const db=new DatabaseSync(path);db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
 CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,username TEXT UNIQUE NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),expires INTEGER);
 CREATE TABLE IF NOT EXISTS scenes(id TEXT PRIMARY KEY,owner_id TEXT REFERENCES users(id),base_id TEXT,revision INTEGER NOT NULL,body TEXT NOT NULL,updated TEXT NOT NULL);
 CREATE UNIQUE INDEX IF NOT EXISTS personal_versions ON scenes(owner_id,base_id) WHERE base_id IS NOT NULL;
 CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY,user_id TEXT,scene_id TEXT,action TEXT,revision INTEGER,created TEXT);`);
 const hash=p=>{const salt=randomBytes(16).toString('hex');return salt+':'+scryptSync(p,salt,64).toString('hex');};
 const check=(p,h)=>{const [salt,value]=h.split(':');return timingSafeEqual(scryptSync(p,salt,64),Buffer.from(value,'hex'));};
 if(adminPassword&&!db.prepare('SELECT id FROM users WHERE username=?').get('admin'))db.prepare('INSERT INTO users VALUES(?,?,?,?)').run(randomUUID(),'admin',hash(adminPassword),'admin');
 const digest=t=>createHash('sha256').update(t).digest('hex'),rates=new Map(),busy=new Set();
 const audit=(u,id,action,revision)=>db.prepare('INSERT INTO audit(user_id,scene_id,action,revision,created) VALUES(?,?,?,?,?)').run(u,id,action,revision,new Date().toISOString());
 const server=http.createServer(async(req,res)=>{
 const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
 try{
 const route=new URL(req.url,'http://local').pathname.replace(/^\/scene\/api/,'/api'),method=req.method;
 if(!route.startsWith('/api/'))return send(404,{error:'接口不存在'});
 const cookie=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('beescene_session='))?.slice(17);
 const user=cookie?db.prepare('SELECT u.id,u.username,u.role FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.token=? AND s.expires>?').get(digest(cookie),Date.now()):null;
 let body={};if(!['GET','HEAD'].includes(method)){
  if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)return send(403,{error:'请求来源不匹配'});
  if(!String(req.headers['content-type']||'').startsWith('application/json'))return send(415,{error:'请使用JSON请求'});
  let text='';for await(const chunk of req){text+=chunk;if(Buffer.byteLength(text)>100000)return send(413,{error:'内容过长'});}try{body=JSON.parse(text||'{}');}catch{return send(400,{error:'JSON格式无效'});}
 }
 if(route==='/api/session'&&method==='GET')return send(200,{user:user||null,generationEnabled:!!(process.env.OPENAI_API_KEY&&process.env.OPENAI_MODEL)});
 if(['/api/register','/api/login'].includes(route)&&method==='POST'){
  const ip=req.headers['x-real-ip']||req.socket.remoteAddress,now=Date.now(),recent=(rates.get(ip)||[]).filter(t=>now-t<900000);if(recent.length>=20)return send(429,{error:'尝试过于频繁，请稍后再试'});recent.push(now);rates.set(ip,recent);
  const {username,password}=body;if(typeof username!=='string'||!/^[-a-zA-Z0-9_]{3,40}$/.test(username)||typeof password!=='string'||password.length<10||password.length>128)return send(400,{error:'用户名需3—40个英文字母、数字或下划线，密码至少10位'});
  let account=db.prepare('SELECT * FROM users WHERE username=?').get(username);
  if(route==='/api/register'){if(username.toLowerCase()==='admin'||account)return send(409,{error:'用户名已被使用'});account={id:randomUUID(),username,password:hash(password),role:'user'};db.prepare('INSERT INTO users VALUES(?,?,?,?)').run(account.id,username,account.password,account.role);}
  else if(!account||!check(password,account.password))return send(401,{error:'用户名或密码错误'});
  db.prepare('DELETE FROM sessions WHERE expires<?').run(now);const token=randomBytes(32).toString('hex');db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(digest(token),account.id,now+604800000);
  res.setHeader('Set-Cookie',`beescene_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800${secure?'; Secure':''}`);return send(200,{user:{id:account.id,username,role:account.role}});
 }
 if(route==='/api/logout'&&method==='POST'){if(cookie)db.prepare('DELETE FROM sessions WHERE token=?').run(digest(cookie));res.setHeader('Set-Cookie',`beescene_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure?'; Secure':''}`);return send(200,{ok:true});}
 if(!user)return send(401,{error:'请先注册或登录'});
 if(route==='/api/scenes'&&method==='GET'){
 const rows=user.role==='admin'?db.prepare('SELECT s.*,u.username FROM scenes s JOIN users u ON s.owner_id=u.id ORDER BY updated DESC').all():db.prepare('SELECT s.*,u.username FROM scenes s JOIN users u ON s.owner_id=u.id WHERE owner_id=? ORDER BY updated DESC').all(user.id);
 return send(200,{scenes:rows.map(r=>({id:r.id,ownerId:r.owner_id,owner:r.username,baseId:r.base_id,revision:r.revision,updated:r.updated,scene:JSON.parse(r.body)}))});
 }
 if(route==='/api/generate'&&method==='POST'){
 if(typeof body.description!=='string'||body.description.trim().length<8||body.description.length>5000)return send(400,{error:'请填写8—5000字的场景描述'});
 const key='gen:'+user.id,now=Date.now(),recent=(rates.get(key)||[]).filter(t=>now-t<3600000);if(recent.length>=10||busy.has(key))return send(429,{error:'每小时最多生成10次，请稍后重试'});recent.push(now);rates.set(key,recent);busy.add(key);try{return send(200,{scene:await generator(body.description)});}finally{busy.delete(key);}
 }
 if(route==='/api/scenes'&&method==='POST'){
 const scene=validateScene(body.scene),baseId=body.baseId||null;
 if(baseId)return send(403,{error:'公共场景不可修改或创建副本，请单独新增场景'});
 const id=randomUUID(),updated=new Date().toISOString();db.prepare('INSERT INTO scenes VALUES(?,?,?,?,?,?)').run(id,user.id,baseId,1,JSON.stringify(scene),updated);audit(user.id,id,'create',1);return send(201,{id,revision:1});
 }
 const match=route.match(/^\/api\/scenes\/([a-f0-9-]{36})$/);
 if(match&&['PUT','DELETE'].includes(method)){
 const existing=db.prepare('SELECT * FROM scenes WHERE id=? AND owner_id=?').get(match[1],user.id);if(!existing)return send(404,{error:'场景不存在或无编辑权限'});
 if(existing.base_id)return send(403,{error:'现有公共场景副本只读，请单独新增场景'});
 if(body.revision!==existing.revision)return send(409,{error:'场景已更新，请刷新后重新编辑'});
 if(method==='DELETE'){db.prepare('DELETE FROM scenes WHERE id=?').run(existing.id);audit(user.id,existing.id,'delete',existing.revision);return send(200,{ok:true});}
 const scene=validateScene(body.scene),revision=existing.revision+1;db.prepare('UPDATE scenes SET body=?,revision=?,updated=? WHERE id=?').run(JSON.stringify(scene),revision,new Date().toISOString(),existing.id);audit(user.id,existing.id,'update',revision);return send(200,{id:existing.id,revision});
 }
 return send(404,{error:'接口不存在'});
 }catch(e){send(e.status||400,{error:e.status?e.message:e.message?.includes('场景')||e.message?.includes('请')||e.message?.includes('无效')||e.message?.includes('格式')?e.message:'请求处理失败'});}
 });server.listen(port,host);return {server,db,close:()=>new Promise(resolve=>server.close(()=>{db.close();resolve();}))};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){start();console.log('BeeScene API listening on loopback');}
