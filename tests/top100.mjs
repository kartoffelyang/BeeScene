import assert from 'node:assert/strict';
import {top100,needDimensions,aiDimensions,vehicleDimensions,filterScenes,exportPayload} from '../src/top100.js';
assert.equal(top100.length,100);
assert.equal(Object.keys(aiDimensions).length,8);
assert.ok(top100.every(s=>s.autonomyMode));
assert.equal(new Set(top100.map(s=>s.name)).size,100);
assert.equal(new Set(top100.map(s=>s.summary)).size,100);
for(const [i,s] of top100.entries()){
 assert.equal(s.rank,i+1); assert.equal(s.id,`TOP-${String(i+1).padStart(3,'0')}`);
 for(const k of ['name','summary','outcome','baseline','question','horizon']) assert.ok(s[k]?.trim(),`${s.id} missing ${k}`);
 assert.ok(['近期试验','条件预研','前瞻探索'].includes(s.horizon));
 assert.ok(s.ai.length&&s.vehicle.length);
 for(const k of s.ai) assert.ok(aiDimensions[k]);
 for(const k of s.vehicle) assert.ok(vehicleDimensions[k]);
 assert.equal(new Set(s.ai).size,s.ai.length); assert.equal(new Set(s.vehicle).size,s.vehicle.length);
 for(const k of ['domain','journey','atoms','requiredAtoms']) assert.ok(!(k in s));
}
for(const k of Object.keys(aiDimensions)) assert.ok(top100.some(s=>s.ai.includes(k)));
for(const k of Object.keys(vehicleDimensions)) assert.ok(top100.some(s=>s.vehicle.includes(k)));
const intersection=filterScenes(top100,{ai:['embodiment'],vehicle:['motion']});
assert.ok(intersection.length>0); assert.ok(intersection.every(s=>s.ai.includes('embodiment')&&s.vehicle.includes('motion')));
const union=filterScenes(top100,{ai:['embodiment','emotion']});
assert.equal(union.length,new Set([...filterScenes(top100,{ai:['embodiment']}),...filterScenes(top100,{ai:['emotion']})]).size);
assert.deepEqual(filterScenes(top100,{query:'  自主补能管家  '}).map(s=>s.id),['TOP-001']);
assert.equal(filterScenes(top100,{query:'3A'}).length,1);
assert.equal(filterScenes(top100,{query:'不存在的命题XYZ'}).length,0);
assert.deepEqual(filterScenes(top100,{savedOnly:true,saved:['TOP-001','TOP-008']}).map(s=>s.rank),[1,8]);
const payload=JSON.parse(JSON.stringify(exportPayload(intersection,['TOP-001'])));
assert.equal(payload.schemaVersion,6); assert.equal(payload.scenarios.length,intersection.length);
assert.ok(payload.scenarios.every(s=>s.rankingReason.includes(s.outcome)));
console.log(JSON.stringify({count:100,AI:Object.fromEntries(Object.keys(aiDimensions).map(k=>[aiDimensions[k],top100.filter(s=>s.ai.includes(k)).length])),vehicle:Object.fromEntries(Object.keys(vehicleDimensions).map(k=>[vehicleDimensions[k],top100.filter(s=>s.vehicle.includes(k)).length])),horizons:Object.fromEntries(['近期试验','条件预研','前瞻探索'].map(k=>[k,top100.filter(s=>s.horizon===k).length])),checks:'PASS'},null,2));

assert.equal(Object.keys(needDimensions).length,5);
for(const s of top100){assert.ok(needDimensions[s.primaryNeed]);assert.ok(s.secondaryNeed===null||needDimensions[s.secondaryNeed]);assert.notEqual(s.primaryNeed,s.secondaryNeed);}
for(const k of Object.keys(needDimensions)){const selected=filterScenes(top100,{needs:[k]});assert.ok(selected.length);assert.ok(selected.every(s=>s.primaryNeed===k||s.secondaryNeed===k));}
const three=filterScenes(top100,{needs:['ease'],ai:['embodiment'],vehicle:['motion']});assert.ok(three.length);assert.ok(three.every(s=>(s.primaryNeed==='ease'||s.secondaryNeed==='ease')&&s.ai.includes('embodiment')&&s.vehicle.includes('motion')));
assert.equal(new Set(filterScenes(top100,{needs:['ease','security']}).map(s=>s.id)).size,filterScenes(top100,{needs:['ease','security']}).length);
console.log('PASS: 100 primary needs, <=1 distinct secondary, five categories, three-dimensional intersection and union without duplicates');
