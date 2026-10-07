import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {once} from 'node:events';
import {start} from '../server/index.mjs';
import {generate} from '../server/model.mjs';
const scene={name:'test',summary:'describe',outcome:'benefit',baseline:'alternative',question:'validate',horizon:'近期试验',autonomyMode:'用户确认',sceneDomain:'cabinDriving',domainReason:'驾驶状态与专用移动系统交接',primaryNeed:'ease',secondaryNeed:null,ai:['intent'],vehicle:['space'],tags:[],interaction:['trigger','understand','plan','authorize','feedback'],en:{name:'Test',domainReason:'Driving-state and dedicated motion-system handoff'},market:[]};
test('private ownership, administrator visibility, revisions, restart persistence and CSRF',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'beescene-test-'));let app=start({path:join(dir,'db.sqlite'),port:0,adminPassword:'test-admin-password',generator:async()=>scene});await once(app.server,'listening');let base=`http://127.0.0.1:${app.server.address().port}/api/`;
 async function req(route,method='GET',body,cookie,origin){const r=await fetch(base+route,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(cookie?{Cookie:cookie}:{}),...(origin?{Origin:origin}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
 try{
 const a=await req('register','POST',{username:'user_a',password:'test-password-a'}),b=await req('register','POST',{username:'user_b',password:'test-password-b'}),admin=await req('login','POST',{username:'admin',password:'test-admin-password'});assert.equal(a.status,200);assert.equal(admin.status,200);
 assert.equal((await req('scenes')).status,401);
 const create=await req('scenes','POST',{scene},a.cookie);assert.equal(create.status,201);const id=create.data.id;
 assert.equal((await req('scenes','POST',{scene,baseId:'TOP-003'},a.cookie)).status,403);
 assert.equal((await req('scenes','POST',{scene:{...scene,primaryNeed:'fake'}},a.cookie)).status,400);
 assert.equal((await req('scenes','POST',{scene:{...scene,sceneDomain:'fake'}},a.cookie)).status,400);
 assert.equal((await req('scenes','POST',{scene,baseId:'TOP-999'},a.cookie)).status,403);
 assert.equal((await req('scenes','POST',{scene:{...scene,market:[{brand:'Brand',model:'Model',region:'',feature:'',boundary:'',source:'javascript:alert(1)',status:'unverified',match:'partial'}]}},a.cookie)).status,400);
 assert.equal((await req('scenes','POST',{scene},a.cookie,'https://evil.test')).status,403);
 assert.equal((await req('scenes', 'GET',null,b.cookie)).data.scenes.length,0);
 assert.equal((await req('scenes', 'GET',null,admin.cookie)).data.scenes.length,1);
 assert.equal((await req('scenes/'+id,'PUT',{scene,revision:1},b.cookie)).status,404);
 assert.equal((await req('scenes/'+id,'PUT',{scene,revision:1},admin.cookie)).status,404);
 assert.equal((await req('scenes/'+id,'DELETE',{revision:1},b.cookie)).status,404);
 assert.equal((await req('scenes/'+id,'PUT',{scene:{...scene,name:'updated'},revision:1},a.cookie)).data.revision,2);
 assert.equal((await req('scenes/'+id,'PUT',{scene,revision:1},a.cookie)).status,409);
 const legacy='11111111-1111-1111-1111-111111111111';app.db.prepare('INSERT INTO scenes VALUES(?,?,?,?,?,?)').run(legacy,a.data.user.id,'TOP-003',1,JSON.stringify(scene),new Date().toISOString());
 assert.equal((await req('scenes/'+legacy,'PUT',{scene,revision:1},a.cookie)).status,403);app.db.prepare('DELETE FROM scenes WHERE id=?').run(legacy);
 assert.equal((await req('generate','POST',{description:'描述足够长的一个测试场景'},a.cookie)).status,200);
 await app.close();app=start({path:join(dir,'db.sqlite'),port:0});await once(app.server,'listening');base=`http://127.0.0.1:${app.server.address().port}/api/`;
 assert.equal((await req('scenes','GET',null,a.cookie)).data.scenes[0].scene.name,'updated');
 assert.equal((await req('scenes','GET',null,a.cookie)).data.scenes[0].scene.sceneDomain,'cabinDriving');
 assert.equal((await req('scenes','GET',null,a.cookie)).data.scenes[0].scene.en.domainReason,scene.en.domainReason);
 await req('logout','POST',{},a.cookie);assert.equal((await req('scenes','GET',null,a.cookie)).status,401);
 }finally{await app.close();rmSync(dir,{recursive:true,force:true});}
});
test('Responses schema request, malformed output, refusal and missing API settings',async()=>{
 let request;const fetcher=async(url,init)=>{request=JSON.parse(init.body);return {ok:true,json:async()=>({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(scene)}]}]})};};
 const result=await generate('test scene',{key:'test-key',model:'test-model',fetcher});assert.equal(result.name,'test');assert.equal(request.store,false);assert.equal(request.text.format.strict,true);assert.equal(request.text.format.schema.additionalProperties,false);
 assert.deepEqual(request.text.format.schema.properties.sceneDomain.enum,['cabin','cabinDriving']);assert.ok(request.text.format.schema.required.includes('domainReason'));assert.equal(result.sceneDomain,'cabinDriving');
 await assert.rejects(generate('test',{key:'',model:''}),/尚未配置/);
 await assert.rejects(generate('test',{key:'test',model:'test',fetcher:async()=>({ok:true,json:async()=>({status:'completed',output:[{content:[{type:'output_text',text:'{}'}]}]})})}),/模板校验/);
 await assert.rejects(generate('test',{key:'test',model:'test',fetcher:async()=>({ok:true,json:async()=>({status:'completed',output:[{content:[{type:'refusal'}]}]})})}),/未完成/);
});
